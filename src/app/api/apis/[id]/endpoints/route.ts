import { NextRequest, NextResponse } from "next/server";
import { HttpMethod, ParamLocation, Prisma } from "@prisma/client";
import { prisma } from "@/db/client";
import { getSessionUserId } from "@/lib/auth/session";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  toApiError,
} from "@/lib/utils/errors";

type EndpointParamInput = {
  name: string;
  location: ParamLocation;
  required?: boolean;
  type: string;
  description: string;
};

type EndpointResponseInput = {
  status: number;
  description: string;
  example?: unknown;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getSessionUserId();
    if (!userId) throw new UnauthorizedError();

    const { id: rawApiId } = await params;
    const apiId = parseInt(rawApiId, 10);
    if (!Number.isFinite(apiId)) throw new ValidationError("ID d'API invalide");

    const api = await prisma.api.findUnique({
      where: { id: apiId },
      select: { userId: true },
    });
    if (!api) throw new NotFoundError("API");
    if (api.userId !== userId) {
      throw new ForbiddenError(
        "Vous ne pouvez documenter que vos propres APIs."
      );
    }

    const body = await req.json();
    const {
      method,
      path,
      summary,
      description,
      tags,
      requestBody,
      parameters,
      responses,
    } = body as {
      method?: string;
      path?: string;
      summary?: string;
      description?: string;
      tags?: string[];
      requestBody?: unknown;
      parameters?: EndpointParamInput[];
      responses?: EndpointResponseInput[];
    };

    if (!method || !Object.values(HttpMethod).includes(method as HttpMethod)) {
      throw new ValidationError("Méthode HTTP invalide.");
    }

    if (!path?.trim()) {
      throw new ValidationError("Le chemin de l'endpoint est requis.");
    }
    if (!summary?.trim()) {
      throw new ValidationError("Le résumé est requis.");
    }
    if (!description?.trim()) {
      throw new ValidationError("La description est requise.");
    }

    if (requestBody !== undefined && requestBody !== null && !isObject(requestBody)) {
      throw new ValidationError("Le corps de requête doit être un objet JSON.");
    }

    const sanitizedParameters = (parameters ?? []).map((param) => ({
      name: param.name?.trim(),
      location: param.location,
      required: Boolean(param.required),
      type: param.type?.trim(),
      description: param.description?.trim(),
    }));

    for (const param of sanitizedParameters) {
      if (
        !param.name ||
        !Object.values(ParamLocation).includes(param.location) ||
        !param.type ||
        !param.description
      ) {
        throw new ValidationError("Un paramètre d'endpoint est invalide.");
      }
    }

    const sanitizedResponses = (responses ?? []).map((response) => ({
      status: response.status,
      description: response.description?.trim(),
      example: response.example,
    }));

    if (sanitizedResponses.length === 0) {
      throw new ValidationError("Au moins une réponse est requise.");
    }

    for (const response of sanitizedResponses) {
      if (
        !Number.isInteger(response.status) ||
        response.status < 100 ||
        response.status > 599 ||
        !response.description
      ) {
        throw new ValidationError("Une réponse d'endpoint est invalide.");
      }
    }

    const createResponses = sanitizedResponses.map((response) => ({
      status: response.status,
      description: response.description,
      ...(response.example === undefined
        ? {}
        : {
            example:
              response.example === null
                ? Prisma.JsonNull
                : (response.example as Prisma.InputJsonValue),
          }),
    }));

    const endpoint = await prisma.endpoint.create({
      data: {
        method: method as HttpMethod,
        path: path.trim(),
        summary: summary.trim(),
        description: description.trim(),
        tags: Array.isArray(tags)
          ? tags.map((tag) => tag.trim()).filter(Boolean)
          : [],
        requestBody:
          requestBody === undefined
            ? undefined
            : requestBody === null
              ? Prisma.JsonNull
              : (requestBody as Prisma.InputJsonValue),
        apiId,
        parameters: {
          create: sanitizedParameters,
        },
        responses: {
          create: createResponses,
        },
      },
      include: {
        parameters: true,
        responses: true,
      },
    });

    return NextResponse.json(endpoint, { status: 201 });
  } catch (error) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

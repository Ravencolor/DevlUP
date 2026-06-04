-- CreateEnum
CREATE TYPE "ApiVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "ApiCategory" AS ENUM ('FINANCE', 'SOCIAL', 'DATA', 'AI', 'HEALTH', 'WEATHER', 'ECOMMERCE', 'COMMUNICATION', 'OTHER');

-- CreateEnum
CREATE TYPE "HttpMethod" AS ENUM ('GET', 'POST', 'PUT', 'DELETE', 'PATCH');

-- CreateEnum
CREATE TYPE "ParamLocation" AS ENUM ('query', 'path', 'header', 'body');

-- CreateTable
CREATE TABLE "Api" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "visibility" "ApiVisibility" NOT NULL DEFAULT 'PUBLIC',
    "category" "ApiCategory" NOT NULL DEFAULT 'OTHER',
    "baseUrl" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Api_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Endpoint" (
    "id" SERIAL NOT NULL,
    "method" "HttpMethod" NOT NULL,
    "path" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[],
    "apiId" INTEGER NOT NULL,
    "requestBody" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Endpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EndpointParam" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" "ParamLocation" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "endpointId" INTEGER NOT NULL,

    CONSTRAINT "EndpointParam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EndpointResponse" (
    "id" SERIAL NOT NULL,
    "status" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "example" JSONB,
    "endpointId" INTEGER NOT NULL,

    CONSTRAINT "EndpointResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Api" ADD CONSTRAINT "Api_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Endpoint" ADD CONSTRAINT "Endpoint_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "Api"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EndpointParam" ADD CONSTRAINT "EndpointParam_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "Endpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EndpointResponse" ADD CONSTRAINT "EndpointResponse_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "Endpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "continent" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    CONSTRAINT "Country_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Trend" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "momentum" TEXT NOT NULL,
    "trendScore" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TrendRegion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trendId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "popularity" INTEGER NOT NULL,
    CONSTRAINT "TrendRegion_trendId_fkey" FOREIGN KEY ("trendId") REFERENCES "Trend" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TrendRegion_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TrendAgeGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trendId" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "popularity" INTEGER NOT NULL,
    CONSTRAINT "TrendAgeGroup_trendId_fkey" FOREIGN KEY ("trendId") REFERENCES "Trend" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TrendDataPoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trendId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "value" REAL NOT NULL,
    CONSTRAINT "TrendDataPoint_trendId_fkey" FOREIGN KEY ("trendId") REFERENCES "Trend" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LifecycleStage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "LifecycleTrend" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stageId" TEXT NOT NULL,
    "trendId" TEXT NOT NULL,
    "insight" TEXT NOT NULL,
    CONSTRAINT "LifecycleTrend_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "LifecycleStage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LifecycleTrend_trendId_fkey" FOREIGN KEY ("trendId") REFERENCES "Trend" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "capabilities" TEXT NOT NULL,
    "minOrderQty" INTEGER NOT NULL,
    "leadTimeDays" INTEGER NOT NULL,
    "costTier" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "website" TEXT,
    "description" TEXT,
    CONSTRAINT "Supplier_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductionHub" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "laborCostIndex" REAL NOT NULL,
    "infrastructureScore" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "yearlyOutput" TEXT,
    CONSTRAINT "ProductionHub_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EthicalScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "sustainabilityScore" REAL NOT NULL,
    "laborScore" REAL NOT NULL,
    "transparencyScore" REAL NOT NULL,
    "overallScore" REAL NOT NULL,
    "supplierId" TEXT,
    CONSTRAINT "EthicalScore_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "issuingBody" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SupplierCertification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplierId" TEXT NOT NULL,
    "certificationId" TEXT NOT NULL,
    CONSTRAINT "SupplierCertification_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SupplierCertification_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "Certification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CountryCompliance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "countryId" TEXT NOT NULL,
    "laborLawSummary" TEXT NOT NULL,
    "minimumWage" TEXT NOT NULL,
    "workingHoursLimit" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL,
    CONSTRAINT "CountryCompliance_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "environmentalImpact" TEXT NOT NULL,
    "renewability" TEXT NOT NULL,
    "carbonFootprint" REAL NOT NULL,
    "waterUsage" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "alternatives" TEXT
);

-- CreateTable
CREATE TABLE "DataSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "lastFetched" DATETIME,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RawDataPoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "fetchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "RawDataPoint_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "DataSource" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Region_code_key" ON "Region"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code");

-- CreateIndex
CREATE UNIQUE INDEX "TrendRegion_trendId_regionId_key" ON "TrendRegion"("trendId", "regionId");

-- CreateIndex
CREATE UNIQUE INDEX "TrendAgeGroup_trendId_ageGroup_key" ON "TrendAgeGroup"("trendId", "ageGroup");

-- CreateIndex
CREATE UNIQUE INDEX "LifecycleStage_name_key" ON "LifecycleStage"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EthicalScore_supplierId_key" ON "EthicalScore"("supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "Certification_name_key" ON "Certification"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierCertification_supplierId_certificationId_key" ON "SupplierCertification"("supplierId", "certificationId");

-- CreateIndex
CREATE UNIQUE INDEX "CountryCompliance_countryId_key" ON "CountryCompliance"("countryId");

-- CreateIndex
CREATE UNIQUE INDEX "Material_name_key" ON "Material"("name");

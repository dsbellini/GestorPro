#!/bin/bash

# Base directories
mkdir -p src/modules/company/{controllers,services,dtos,entities}
mkdir -p src/modules/address/{controllers,services,dtos,entities}
mkdir -p src/common/{filters,interceptors,utils}
mkdir -p src/prisma

# Prisma files
touch src/prisma/prisma.service.ts
touch src/prisma/prisma.module.ts

# Company module files
touch src/modules/company/company.module.ts
touch src/modules/company/controllers/company.controller.ts
touch src/modules/company/services/company.service.ts
touch src/modules/company/dtos/create-company.dto.ts
touch src/modules/company/dtos/update-company.dto.ts
touch src/modules/company/entities/company.entity.ts

# Address module files
touch src/modules/address/address.module.ts
touch src/modules/address/controllers/address.controller.ts
touch src/modules/address/services/address.service.ts
touch src/modules/address/dtos/create-address.dto.ts
touch src/modules/address/dtos/update-address.dto.ts
touch src/modules/address/entities/address.entity.ts

# Common files
touch src/common/filters/http-exception.filter.ts
touch src/common/interceptors/logging.interceptor.ts
touch src/common/utils/email.service.ts

# App bootstrap files
touch src/app.module.ts
touch src/main.ts

echo "Estrutura de pastas e arquivos criada com sucesso!"

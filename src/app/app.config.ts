import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideServiceWorker } from '@angular/service-worker';
import { PlantRepository } from './domain/repositories/plant.repository';
import { MockPlantRepository } from './infrastructure/repositories/mock-plant.repository';
import { UserRepository } from './domain/repositories/user.repository';
import { MockUserRepository } from './infrastructure/repositories/mock-user.repository';
import { CompoundRepository } from './domain/repositories/compound.repository';
import { MockCompoundRepository } from './infrastructure/repositories/mock-compound.repository';
import { ExternalApiRepository } from './domain/repositories/external-api.repository';
import { MockExternalApiRepository } from './infrastructure/repositories/mock-external-api.repository';
import { ArticleRepository } from './domain/repositories/article.repository';
import { MockArticleRepository } from './infrastructure/repositories/mock-article.repository';
import { EthnobotanicalRecordRepository } from './domain/repositories/ethnobotanical-record.repository';
import { MockEthnobotanicalRecordRepository } from './infrastructure/repositories/mock-ethnobotanical-record.repository';
import { GenomicDataRepository } from './domain/repositories/genomic-data.repository';
import { MockGenomicDataRepository } from './infrastructure/repositories/mock-genomic-data.repository';
import { OntologyTermRepository } from './domain/repositories/ontology-term.repository';
import { MockOntologyTermRepository } from './infrastructure/repositories/mock-ontology-term.repository';
import { RegionalAvailabilityRepository } from './domain/repositories/regional-availability.repository';
import { MockRegionalAvailabilityRepository } from './infrastructure/repositories/mock-regional-availability.repository';
import { DrugReferenceRepository } from './domain/repositories/drug-reference.repository';
import { MockDrugReferenceRepository } from './infrastructure/repositories/mock-drug-reference.repository';
import { InferenceJobRepository } from './domain/repositories/inference-job.repository';
import { MockInferenceJobRepository } from './infrastructure/repositories/mock-inference-job.repository';
import { DataPipelineRepository } from './domain/repositories/data-pipeline.repository';
import { MockDataPipelineRepository } from './infrastructure/repositories/mock-data-pipeline.repository';
import { ImageLogRepository } from './domain/repositories/image-log.repository';
import { MockImageLogRepository } from './infrastructure/repositories/mock-image-log.repository';
import { QueryLogRepository } from './domain/repositories/query-log.repository';
import { MockQueryLogRepository } from './infrastructure/repositories/mock-query-log.repository';
import { ModerationItemRepository } from './domain/repositories/moderation-item.repository';
import { MockModerationItemRepository } from './infrastructure/repositories/mock-moderation-item.repository';
import { ModelVersionRepository } from './domain/repositories/model-version.repository';
import { MockModelVersionRepository } from './infrastructure/repositories/mock-model-version.repository';
import { AuditLogRepository } from './domain/repositories/audit-log.repository';
import { MockAuditLogRepository } from './infrastructure/repositories/mock-audit-log.repository';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loadingInterceptor } from './infrastructure/interceptors/loading.interceptor';
import { authInterceptor } from './infrastructure/interceptors/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor])),
    provideIonicAngular({}),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    { provide: PlantRepository, useClass: MockPlantRepository },
    { provide: UserRepository, useClass: MockUserRepository },
    { provide: CompoundRepository, useClass: MockCompoundRepository },
    { provide: ExternalApiRepository, useClass: MockExternalApiRepository },
    { provide: ArticleRepository, useClass: MockArticleRepository },
    { provide: EthnobotanicalRecordRepository, useClass: MockEthnobotanicalRecordRepository },
    { provide: GenomicDataRepository, useClass: MockGenomicDataRepository },
    { provide: OntologyTermRepository, useClass: MockOntologyTermRepository },
    { provide: RegionalAvailabilityRepository, useClass: MockRegionalAvailabilityRepository },
    { provide: DrugReferenceRepository, useClass: MockDrugReferenceRepository },
    { provide: InferenceJobRepository, useClass: MockInferenceJobRepository },
    { provide: DataPipelineRepository, useClass: MockDataPipelineRepository },
    { provide: ImageLogRepository, useClass: MockImageLogRepository },
    { provide: QueryLogRepository, useClass: MockQueryLogRepository },
    { provide: ModerationItemRepository, useClass: MockModerationItemRepository },
    { provide: ModelVersionRepository, useClass: MockModelVersionRepository },
    { provide: AuditLogRepository, useClass: MockAuditLogRepository },
    provideCharts(withDefaultRegisterables())
  ]
};

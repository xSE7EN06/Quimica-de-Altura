import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideServiceWorker } from '@angular/service-worker';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loadingInterceptor } from './infrastructure/interceptors/loading.interceptor';
import { authInterceptor } from './infrastructure/interceptors/auth.interceptor';

import { PlantRepository } from './domain/repositories/plant.repository';
import { HttpPlantRepository } from './infrastructure/repositories/http-plant.repository';
import { UserRepository } from './domain/repositories/user.repository';
import { HttpUserRepository } from './infrastructure/repositories/http-user.repository';
import { CompoundRepository } from './domain/repositories/compound.repository';
import { HttpCompoundRepository } from './infrastructure/repositories/http-compound.repository';
import { ExternalApiRepository } from './domain/repositories/external-api.repository';
import { HttpExternalApiRepository } from './infrastructure/repositories/http-external-api.repository';
import { ArticleRepository } from './domain/repositories/article.repository';
import { HttpArticleRepository } from './infrastructure/repositories/http-article.repository';
import { EthnobotanicalRecordRepository } from './domain/repositories/ethnobotanical-record.repository';
import { HttpEthnobotanicalRecordRepository } from './infrastructure/repositories/http-ethnobotanical-record.repository';
import { GenomicDataRepository } from './domain/repositories/genomic-data.repository';
import { HttpGenomicDataRepository } from './infrastructure/repositories/http-genomic-data.repository';
import { OntologyTermRepository } from './domain/repositories/ontology-term.repository';
import { HttpOntologyTermRepository } from './infrastructure/repositories/http-ontology-term.repository';
import { RegionalAvailabilityRepository } from './domain/repositories/regional-availability.repository';
import { HttpRegionalAvailabilityRepository } from './infrastructure/repositories/http-regional-availability.repository';
import { DrugReferenceRepository } from './domain/repositories/drug-reference.repository';
import { HttpDrugReferenceRepository } from './infrastructure/repositories/http-drug-reference.repository';
import { InferenceJobRepository } from './domain/repositories/inference-job.repository';
import { HttpInferenceJobRepository } from './infrastructure/repositories/http-inference-job.repository';
import { DataPipelineRepository } from './domain/repositories/data-pipeline.repository';
import { HttpDataPipelineRepository } from './infrastructure/repositories/http-data-pipeline.repository';
import { ImageLogRepository } from './domain/repositories/image-log.repository';
import { HttpImageLogRepository } from './infrastructure/repositories/http-image-log.repository';
import { QueryLogRepository } from './domain/repositories/query-log.repository';
import { HttpQueryLogRepository } from './infrastructure/repositories/http-query-log.repository';
import { ModerationItemRepository } from './domain/repositories/moderation-item.repository';
import { HttpModerationItemRepository } from './infrastructure/repositories/http-moderation-item.repository';
import { ModelVersionRepository } from './domain/repositories/model-version.repository';
import { HttpModelVersionRepository } from './infrastructure/repositories/http-model-version.repository';
import { AuditLogRepository } from './domain/repositories/audit-log.repository';
import { HttpAuditLogRepository } from './infrastructure/repositories/http-audit-log.repository';


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
    { provide: PlantRepository, useClass: HttpPlantRepository },
    { provide: UserRepository, useClass: HttpUserRepository },
    { provide: CompoundRepository, useClass: HttpCompoundRepository },
    { provide: ExternalApiRepository, useClass: HttpExternalApiRepository },
    { provide: ArticleRepository, useClass: HttpArticleRepository },
    { provide: EthnobotanicalRecordRepository, useClass: HttpEthnobotanicalRecordRepository },
    { provide: GenomicDataRepository, useClass: HttpGenomicDataRepository },
    { provide: OntologyTermRepository, useClass: HttpOntologyTermRepository },
    { provide: RegionalAvailabilityRepository, useClass: HttpRegionalAvailabilityRepository },
    { provide: DrugReferenceRepository, useClass: HttpDrugReferenceRepository },
    { provide: InferenceJobRepository, useClass: HttpInferenceJobRepository },
    { provide: DataPipelineRepository, useClass: HttpDataPipelineRepository },
    { provide: ImageLogRepository, useClass: HttpImageLogRepository },
    { provide: QueryLogRepository, useClass: HttpQueryLogRepository },
    { provide: ModerationItemRepository, useClass: HttpModerationItemRepository },
    { provide: ModelVersionRepository, useClass: HttpModelVersionRepository },
    { provide: AuditLogRepository, useClass: HttpAuditLogRepository },
    provideCharts(withDefaultRegisterables())
  ]
};

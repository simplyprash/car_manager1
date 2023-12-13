// default area
import request from 'supertest';
import {Test} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {HttpService, HttpModule} from '@nestjs/axios';
import {ConfigModule, ConfigService} from '@nestjs/config';

// src area
import {AppModule} from '../../../../src/app.module';
import {CertificationStatus} from '../../../../src/blockchain/model/certification-status';
import {EnergyType} from '../../../../src/unit/model/type/energy-types';
import {MeterType} from '../../../../src/db-repository/model/type/meter-type';
import {SignalDevaluationDto} from '../../../../src/sites/controller/dto/signal-devaluation.dto';
import {SignalQuality} from '../../../../src/db-repository/model/type/signal-quality';
import {AssetDto} from 'src/sites/controller/dto/asset.dto';
import {ProductDto} from '../../../../src/sites/controller/dto/product.dto';

// mock area
import {schemeMock, certSchemeName} from '../../../mocks/scheme';
import {siteMock, assetMock, tokenizationMeterMock, tokenizationPackagedSignalsMock, balanceMeterMock, balancePackagedSignalsMock, fullyConfiguredSiteName, productMock} from '../../../mocks/site';

// helper area
import {getOrganization} from '../../../lib/http-servers';

let configService: ConfigService,
    certBodyUserToken: string,
    certBodyOrgId: string,
    siteId: string,
    productId: string,
    meterId: string,
    assetOperatorUserToken: string,
    httpService: HttpService,
    assetOperatorOrgId: string,
    assetId: string,
    balanceMeterId: string,
    app: INestApplication,
    createdBalanceMeterSignals;


describe('All tests', ()=> {
    describe('Asset owner', ()=> {
        beforeAll(async ()=> {
            const moduleRef = await Test.createTestingModule({
                imports: [AppModule, HttpModule.registerAsync({
                    useFactory: () => ({
                        timeout: 5000,
                        maxRedirects: 5,
                    })}),
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: ['.env.localBc', '.env.local', '.env.jest', '.env'],
                }),
                ],
                providers: [ConfigService],
            }).compile();
            configService = moduleRef.get<ConfigService>(ConfigService);
            httpService = moduleRef.get<HttpService>(HttpService);
            app = moduleRef.createNestApplication();
            await app.init();
        });

        describe('cert body config', () => {
            beforeAll(async () => {
                const certBodyUserResponse = await httpService.post(
                    `${configService
                        .get('KEYCLOAK_AUTH_SERVER_URL')}/realms/${configService
                        .get('KEYCLOAK_REALM')}/protocol/openid-connect/token`,
                    {
                        username: configService.get('KEYCLOAK_JEST_CERT_BODY_USERNAME'),
                        password: configService.get('KEYCLOAK_JEST_CERT_BODY_PASSWORD'),
                        grant_type: 'password',
                        client_id: 'cec-web-ui',

                    },
                    {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).toPromise();
                certBodyUserToken =
                    `${certBodyUserResponse.data.token_type} ${certBodyUserResponse.data.access_token}`;
            });

            it('should get cert body organization', async () => {
                const organization = await getOrganization(
                    app.getHttpServer(),
                    certBodyUserToken,
                ).expect(200);

                certBodyOrgId = organization.body.id;
            });

            it('should create certification scheme',  async () => {
                const result : any = await request(app.getHttpServer())
                    .put(`/scheme/${certSchemeName}`)
                    .set('Accept', 'application/json')
                    .set('Authorization', certBodyUserToken)
                    .send({
                        ...schemeMock,
                    })
                    .expect(200)
                    .catch(console.error);
            });

            it('should approve certification scheme',  async () => {
                await request(app.getHttpServer())
                    .put(`/scheme/${certSchemeName}/approve`)
                    .set('Accept', 'application/json')
                    .set('Authorization', certBodyUserToken)
                    .expect(200)
                    .catch(console.error);
            });

            it('should have certification scheme',  async () => {
                const result : any = await request(app.getHttpServer())
                    .get('/scheme')
                    .set('Accept', 'application/json')
                    .set('Authorization', certBodyUserToken)
                    .expect(200)
                    .catch(console.error);

                if (result) {
                    expect(result.body.length).toBeGreaterThan(0);
                    const addedCertScheme = result.body.filter((certScheme) => certScheme === certSchemeName).pop();
                    if (addedCertScheme) {
                        expect(addedCertScheme).toBeDefined();
                    }
                }
            });

            it('should have certification scheme status approved',  async () => {
                const result : any = await request(app.getHttpServer())
                    .get(`/scheme/${certSchemeName}/status`)
                    .set('Accept', 'application/json')
                    .set('Authorization', certBodyUserToken)
                    .expect(200)
                    .catch(console.error);

                if (result) {
                    expect(result.body.status).toBe('Approved');
                }
            });
        });

        describe('asset operator site config', () => {
            const editBalanceMeterDevaluationSignal: SignalDevaluationDto = {
                certificationSchemeName: schemeMock.name,
                wallet: 'some_wallet_address',
                energyType: EnergyType.ELECTRICITY,
            };

            beforeEach(async () => {
                const assetOperatorUserResponse = await httpService.post(
                    `${configService
                        .get('KEYCLOAK_AUTH_SERVER_URL')}/realms/${configService
                        .get('KEYCLOAK_REALM')}/protocol/openid-connect/token`,
                    {
                        username: configService.get('KEYCLOAK_JEST_ASSET_OPERATOR_USERNAME'),
                        password: configService.get('KEYCLOAK_JEST_ASSET_OPERATOR_PASSWORD'),
                        grant_type: 'password',
                        client_id: 'cec-web-ui',

                    },
                    {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).toPromise();
                assetOperatorUserToken =
                    `${assetOperatorUserResponse.data.token_type} ${assetOperatorUserResponse.data.access_token}`;
            });

            it('should get organization', async () => {
                const organization = await getOrganization(
                    app.getHttpServer(),
                    assetOperatorUserToken,
                ).expect(200);

                assetOperatorOrgId = organization.body.id;
            });

            it('should create Site', async ()=> {
                const fullyConfiguredSiteMock = {
                    ...siteMock,
                    name: fullyConfiguredSiteName,
                };

                const site: any = await request(app.getHttpServer())
                    .post('/site')
                    .set('Accept', 'application/json')
                    .set('Authorization', assetOperatorUserToken)
                    .send({
                        ...fullyConfiguredSiteMock,
                        organizationId: assetOperatorOrgId,
                    })
                    .expect(201)
                    .catch(console.error);

                siteId = site.body.id;
                expect(site.body.wallet).toBeDefined();
            });


            it('should create asset', async ()=> {
                const assetResponse: any = await request(app.getHttpServer())
                    .post(`/site/${siteId}/asset`)
                    .set('Accept', 'application/json')
                    .set('Authorization', assetOperatorUserToken)
                    .send({
                        ...assetMock,
                        dateOfFirstOperation: null,
                    })
                    .expect(201)
                    .catch(console.error);
                const createdAsset = assetResponse.body;
                assetId = createdAsset.id;

                const product = createdAsset.products[0] as ProductDto;

                productId = product.id;
                meterId = product.meters.filter((meter) => meter.type === MeterType.TOKEN).pop().id.toString();

                expect(createdAsset.standardDensity).toBe(10);
                expect(createdAsset.rootPhysicalQuantity).toBe('mass');
            });

            it('should edit asset', async () => {
                if (assetId) {
                    const editedAssetResponse = await request(app.getHttpServer())
                        .put(`/site/${siteId}/asset/${assetId}`)
                        .set('Accept', 'application/json')
                        .set('Authorization', assetOperatorUserToken)
                        .send({
                            ...assetMock,
                            standardDensity: 11,
                        })
                        .expect(200);
                    const editedAsset = editedAssetResponse.body;
                    expect(editedAsset.standardDensity).toBe(11);
                }
            });

            it('should edit product', async () => {
                if (productId) {
                    await request(app.getHttpServer())
                        .put(`/site/${siteId}/asset/${assetId}/product/${productId}`)
                        .set('Accept', 'application/json')
                        .set('Authorization', assetOperatorUserToken)
                        .send({
                            ...productMock,
                        })
                        .expect(200);

                    // Subsequent request to mimic FE call to BE.
                    // Updates certification scheme name.
                    await request(app.getHttpServer())
                        .put(`/site/${siteId}/asset/${assetId}/product/${productId}`)
                        .set('Accept', 'application/json')
                        .set('Authorization', assetOperatorUserToken)
                        .send({
                            ...productMock,
                            certificationSchemeName: certSchemeName,
                            certificationBodyId: certBodyOrgId,
                        })
                        .expect(200);
                }
            });

            it('should retrieve site full', async () => {
                await request(app.getHttpServer())
                    .get(`/site/${siteId}/full`)
                    .set('Accept', 'application/json')
                    .set('Authorization', assetOperatorUserToken)
                    .expect(200);
            });

            it('should edit tokenization meter', async () => {
                if (meterId) {
                    // Updates energy type.
                    await request(app.getHttpServer())
                        .put(`/site/${siteId}/asset/${assetId}/product/${productId}/meter/${meterId}`)
                        .set('Accept', 'application/json')
                        .set('Authorization', assetOperatorUserToken)
                        .send({
                            ...tokenizationMeterMock,
                        })
                        .expect(200);
                }
            });

            it('should create tokenization packaged signals', async () => {
                if (meterId) {
                    const res1 = await request(app.getHttpServer())
                        .post(`/site/${siteId}/asset/${assetId}/product/${productId}/meter/${meterId}/signal/packaged`)
                        .set('Accept', 'application/json')
                        .set('Authorization', assetOperatorUserToken)
                        .send([
                            ...tokenizationPackagedSignalsMock,
                        ])
                        .expect(201);
                }
            });

            it('should create balance meter', async () => {
                const meterResponse = await request(app.getHttpServer())
                    .post(`/site/${siteId}/asset/${assetId}/product/${productId}/meter`)
                    .set('Accept', 'application/json')
                    .set('Authorization', assetOperatorUserToken)
                    .send({
                        ...balanceMeterMock,
                    })
                    .expect(201);

                balanceMeterId = meterResponse.body.id;
            });

            it('should create balance packaged signals', async () => {
                const createdSignalsResponse = await request(app.getHttpServer())
                    .post(
                        `/site/${siteId}/asset/${assetId}/product/${productId}/meter/${balanceMeterId}/signal/packaged`,
                    )
                    .set('Accept', 'application/json')
                    .set('Authorization', assetOperatorUserToken)
                    .send([
                        ...balancePackagedSignalsMock,
                    ])
                    .expect(201);

                createdBalanceMeterSignals = createdSignalsResponse.body;

                expect(createdBalanceMeterSignals[0].devaluation.certificationSchemeName)
                    .toBe(balancePackagedSignalsMock[0].devaluation.certificationSchemeName);
                expect(createdBalanceMeterSignals[0].devaluation.wallet)
                    .toBe(balancePackagedSignalsMock[0].devaluation.wallet);
                expect(createdBalanceMeterSignals[0].devaluation.energyType)
                    .toBe(balancePackagedSignalsMock[0].devaluation.energyType);
            });

            it('should edit balance packaged signals', async () => {
                createdBalanceMeterSignals[0].devaluation = {
                    certificationSchemeName: schemeMock.name,
                    wallet: 'some_wallet_address',
                    energyType: EnergyType.ELECTRICITY,
                };

                await request(app.getHttpServer())
                    .put(
                        `/site/${siteId}/asset/${assetId}/product/${productId}/meter/${balanceMeterId}/signal/packaged`,
                    )
                    .set('Accept', 'application/json')
                    .set('Authorization', assetOperatorUserToken)
                    .send([
                        ...createdBalanceMeterSignals,
                    ])
                    .expect(200);
            });

            it('should approve asset by certification body', async () => {
                const certBodyUserResponse = await httpService.post(
                    `${configService
                        .get('KEYCLOAK_AUTH_SERVER_URL')}/realms/${configService
                        .get('KEYCLOAK_REALM')}/protocol/openid-connect/token`,
                    {
                        username: configService.get('KEYCLOAK_JEST_CERT_BODY_USERNAME'),
                        password: configService.get('KEYCLOAK_JEST_CERT_BODY_PASSWORD'),
                        grant_type: 'password',
                        client_id: 'cec-web-ui',

                    },
                    {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).toPromise();
                certBodyUserToken =
                    `${certBodyUserResponse.data.token_type} ${certBodyUserResponse.data.access_token}`;

                if (assetId) {
                    const asset = await request(app.getHttpServer())
                        .put(`/site/${siteId}/asset/${assetId}/certification`)
                        .set('Accept', 'application/json')
                        .set('Authorization', certBodyUserToken)
                        .send({
                            isApproved: true,
                        })
                        .expect(200);
                }
            });

            it('should retrieve site', async () => {
                const site = await request(app.getHttpServer())
                    .get(`/site/${siteId}`)
                    .set('Accept', 'application/json')
                    .set('Authorization', assetOperatorUserToken)
                    .expect(200);

                // tokenization meter
                const tokenizationMeter = site.body.assets[0].products[0].meters[0];

                expect(tokenizationMeter.id).toBe(meterId);
                expect(tokenizationMeter.type).toBe(MeterType.TOKEN);

                const balanceMeter = site.body.assets[0].products[0].meters[1];

                expect(balanceMeter.id).toBe(balanceMeterId);
                expect(balanceMeter.type).toBe(MeterType.BALANCE);
                expect(balanceMeter.signals[0].devaluation.energyType)
                    .toBe(editBalanceMeterDevaluationSignal.energyType);
                expect(balanceMeter.signals[0].devaluation.wallet)
                    .toBe(editBalanceMeterDevaluationSignal.wallet);
                expect(balanceMeter.signals[0].devaluation.certificationSchemeName)
                    .toBe(editBalanceMeterDevaluationSignal.certificationSchemeName);
            });

            it('should retrieve site full', async () => {
                const siteFull = await request(app.getHttpServer())
                    .get(`/site/${siteId}/full`)
                    .set('Accept', 'application/json')
                    .set('Authorization', assetOperatorUserToken)
                    .expect(200);

                // asset
                const asset = siteFull.body.assets[0] as AssetDto;

                const product = asset.products[0];

                expect(product.certificationSchemeName).toBe(certSchemeName);
                expect(product.certificationStatus).toBe(CertificationStatus.APPROVED);

                // tokenization meter
                const tokenizationMeter = product.meters[0];

                expect(tokenizationMeter.id).toBe(meterId);
                expect(tokenizationMeter.type).toBe(MeterType.TOKEN);
                expect(tokenizationMeter.signals[0].tokenizedValue).toBe('0');
                expect(tokenizationMeter.signals[1].tokenizedValue).toBe(SignalQuality.BAD);

                // balance meter
                const balanceMeter = product.meters[1];

                expect(balanceMeter.id).toBe(balanceMeterId);
                expect(balanceMeter.type).toBe(MeterType.BALANCE);
                expect(balanceMeter.signals[0].tokenizedValue).toBe('0');
                expect(balanceMeter.signals[0].devaluation.energyType)
                    .toBe(editBalanceMeterDevaluationSignal.energyType);
                expect(balanceMeter.signals[0].devaluation.wallet)
                    .toBe(editBalanceMeterDevaluationSignal.wallet);
                expect(balanceMeter.signals[0].devaluation.certificationSchemeName)
                    .toBe(editBalanceMeterDevaluationSignal.certificationSchemeName);
                expect(balanceMeter.signals[1].tokenizedValue).toBe(SignalQuality.BAD);
            });

        });

        afterAll(async () => {
            await app.close();
        });

    });
});

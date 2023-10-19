import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Attendance e2e test', () => {
  const attendancePageUrl = '/attendance';
  const attendancePageUrlPattern = new RegExp('/attendance(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const attendanceSample = {};

  let attendance;
  let person;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/people',
      body: { name: 'tourist geez', motherName: 'whoever', birthdate: '2023-10-19', email: 'Jerad.Borer79@hotmail.com' },
    }).then(({ body }) => {
      person = body;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/attendances+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/attendances').as('postEntityRequest');
    cy.intercept('DELETE', '/api/attendances/*').as('deleteEntityRequest');
  });

  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/people', {
      statusCode: 200,
      body: [person],
    });
  });

  afterEach(() => {
    if (attendance) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/attendances/${attendance.id}`,
      }).then(() => {
        attendance = undefined;
      });
    }
  });

  afterEach(() => {
    if (person) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/people/${person.id}`,
      }).then(() => {
        person = undefined;
      });
    }
  });

  it('Attendances menu should load Attendances page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('attendance');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Attendance').should('exist');
    cy.url().should('match', attendancePageUrlPattern);
  });

  describe('Attendance page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(attendancePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Attendance page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/attendance/new$'));
        cy.getEntityCreateUpdateHeading('Attendance');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', attendancePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/attendances',
          body: {
            ...attendanceSample,
            professional: person,
            patient: person,
          },
        }).then(({ body }) => {
          attendance = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/attendances+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/attendances?page=0&size=20>; rel="last",<http://localhost/api/attendances?page=0&size=20>; rel="first"',
              },
              body: [attendance],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(attendancePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Attendance page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('attendance');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', attendancePageUrlPattern);
      });

      it('edit button click should load edit Attendance page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Attendance');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', attendancePageUrlPattern);
      });

      it('edit button click should load edit Attendance page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Attendance');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', attendancePageUrlPattern);
      });

      it('last delete button click should delete instance of Attendance', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('attendance').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', attendancePageUrlPattern);

        attendance = undefined;
      });
    });
  });

  describe('new Attendance page', () => {
    beforeEach(() => {
      cy.visit(`${attendancePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Attendance');
    });

    it('should create an instance of Attendance', () => {
      cy.get(`[data-cy="dateTime"]`).type('2023-10-19T14:34');
      cy.get(`[data-cy="dateTime"]`).blur();
      cy.get(`[data-cy="dateTime"]`).should('have.value', '2023-10-19T14:34');

      cy.get(`[data-cy="place"]`).select('TERRITORY');

      cy.get(`[data-cy="howMany"]`).select('GROUP');

      cy.get(`[data-cy="professional"]`).select([0]);
      cy.get(`[data-cy="patient"]`).select([0]);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        attendance = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', attendancePageUrlPattern);
    });
  });
});

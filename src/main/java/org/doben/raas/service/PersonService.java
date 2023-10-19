package org.doben.raas.service;

import java.util.Optional;
import org.doben.raas.domain.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link org.doben.raas.domain.Person}.
 */
public interface PersonService {
    /**
     * Save a person.
     *
     * @param person the entity to save.
     * @return the persisted entity.
     */
    Person save(Person person);

    /**
     * Updates a person.
     *
     * @param person the entity to update.
     * @return the persisted entity.
     */
    Person update(Person person);

    /**
     * Partially updates a person.
     *
     * @param person the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Person> partialUpdate(Person person);

    /**
     * Get all the people.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Person> findAll(Pageable pageable);

    /**
     * Get the "id" person.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Person> findOne(Long id);

    /**
     * Delete the "id" person.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}

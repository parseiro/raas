package org.doben.raas.service;

import java.util.Optional;
import org.doben.raas.domain.Attendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link org.doben.raas.domain.Attendance}.
 */
public interface AttendanceService {
    /**
     * Save a attendance.
     *
     * @param attendance the entity to save.
     * @return the persisted entity.
     */
    Attendance save(Attendance attendance);

    /**
     * Updates a attendance.
     *
     * @param attendance the entity to update.
     * @return the persisted entity.
     */
    Attendance update(Attendance attendance);

    /**
     * Partially updates a attendance.
     *
     * @param attendance the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Attendance> partialUpdate(Attendance attendance);

    /**
     * Get all the attendances.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Attendance> findAll(Pageable pageable);

    /**
     * Get the "id" attendance.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Attendance> findOne(Long id);

    /**
     * Delete the "id" attendance.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}

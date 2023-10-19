package org.doben.raas.service.impl;

import java.util.Optional;
import org.doben.raas.domain.Attendance;
import org.doben.raas.repository.AttendanceRepository;
import org.doben.raas.service.AttendanceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link org.doben.raas.domain.Attendance}.
 */
@Service
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final Logger log = LoggerFactory.getLogger(AttendanceServiceImpl.class);

    private final AttendanceRepository attendanceRepository;

    public AttendanceServiceImpl(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    @Override
    public Attendance save(Attendance attendance) {
        log.debug("Request to save Attendance : {}", attendance);
        return attendanceRepository.save(attendance);
    }

    @Override
    public Attendance update(Attendance attendance) {
        log.debug("Request to update Attendance : {}", attendance);
        return attendanceRepository.save(attendance);
    }

    @Override
    public Optional<Attendance> partialUpdate(Attendance attendance) {
        log.debug("Request to partially update Attendance : {}", attendance);

        return attendanceRepository
            .findById(attendance.getId())
            .map(existingAttendance -> {
                if (attendance.getDateTime() != null) {
                    existingAttendance.setDateTime(attendance.getDateTime());
                }
                if (attendance.getPlace() != null) {
                    existingAttendance.setPlace(attendance.getPlace());
                }
                if (attendance.getHowMany() != null) {
                    existingAttendance.setHowMany(attendance.getHowMany());
                }

                return existingAttendance;
            })
            .map(attendanceRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Attendance> findAll(Pageable pageable) {
        log.debug("Request to get all Attendances");
        return attendanceRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Attendance> findOne(Long id) {
        log.debug("Request to get Attendance : {}", id);
        return attendanceRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Attendance : {}", id);
        attendanceRepository.deleteById(id);
    }
}

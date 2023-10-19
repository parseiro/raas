package org.doben.raas.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.doben.raas.domain.enumeration.HowMany;
import org.doben.raas.domain.enumeration.Place;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Attendance.
 */
@Entity
@Table(name = "attendance")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Attendance implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "date_time")
    private Instant dateTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "place")
    private Place place;

    @Enumerated(EnumType.STRING)
    @Column(name = "how_many")
    private HowMany howMany;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "attendancesAsProfessional")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "attendancesAsProfessional", "attendancesAsPatient" }, allowSetters = true)
    private Set<Person> professionals = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "attendancesAsPatient")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "attendancesAsProfessional", "attendancesAsPatient" }, allowSetters = true)
    private Set<Person> patients = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Attendance id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDateTime() {
        return this.dateTime;
    }

    public Attendance dateTime(Instant dateTime) {
        this.setDateTime(dateTime);
        return this;
    }

    public void setDateTime(Instant dateTime) {
        this.dateTime = dateTime;
    }

    public Place getPlace() {
        return this.place;
    }

    public Attendance place(Place place) {
        this.setPlace(place);
        return this;
    }

    public void setPlace(Place place) {
        this.place = place;
    }

    public HowMany getHowMany() {
        return this.howMany;
    }

    public Attendance howMany(HowMany howMany) {
        this.setHowMany(howMany);
        return this;
    }

    public void setHowMany(HowMany howMany) {
        this.howMany = howMany;
    }

    public Set<Person> getProfessionals() {
        return this.professionals;
    }

    public void setProfessionals(Set<Person> people) {
        if (this.professionals != null) {
            this.professionals.forEach(i -> i.setAttendancesAsProfessional(null));
        }
        if (people != null) {
            people.forEach(i -> i.setAttendancesAsProfessional(this));
        }
        this.professionals = people;
    }

    public Attendance professionals(Set<Person> people) {
        this.setProfessionals(people);
        return this;
    }

    public Attendance addProfessional(Person person) {
        this.professionals.add(person);
        person.setAttendancesAsProfessional(this);
        return this;
    }

    public Attendance removeProfessional(Person person) {
        this.professionals.remove(person);
        person.setAttendancesAsProfessional(null);
        return this;
    }

    public Set<Person> getPatients() {
        return this.patients;
    }

    public void setPatients(Set<Person> people) {
        if (this.patients != null) {
            this.patients.forEach(i -> i.setAttendancesAsPatient(null));
        }
        if (people != null) {
            people.forEach(i -> i.setAttendancesAsPatient(this));
        }
        this.patients = people;
    }

    public Attendance patients(Set<Person> people) {
        this.setPatients(people);
        return this;
    }

    public Attendance addPatient(Person person) {
        this.patients.add(person);
        person.setAttendancesAsPatient(this);
        return this;
    }

    public Attendance removePatient(Person person) {
        this.patients.remove(person);
        person.setAttendancesAsPatient(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Attendance)) {
            return false;
        }
        return getId() != null && getId().equals(((Attendance) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Attendance{" +
            "id=" + getId() +
            ", dateTime='" + getDateTime() + "'" +
            ", place='" + getPlace() + "'" +
            ", howMany='" + getHowMany() + "'" +
            "}";
    }
}

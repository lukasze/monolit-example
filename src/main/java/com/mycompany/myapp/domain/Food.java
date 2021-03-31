package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Food.
 */
@Entity
@Table(name = "food")
public class Food implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "calories")
    private Float calories;

    @Column(name = "proteins")
    private Float proteins;

    @Column(name = "carbs")
    private Float carbs;

    @Column(name = "fats")
    private Float fats;

    @OneToMany(mappedBy = "food")
    @JsonIgnoreProperties(value = { "food" }, allowSetters = true)
    private Set<Meal> meals = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Food id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Food name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Float getCalories() {
        return this.calories;
    }

    public Food calories(Float calories) {
        this.calories = calories;
        return this;
    }

    public void setCalories(Float calories) {
        this.calories = calories;
    }

    public Float getProteins() {
        return this.proteins;
    }

    public Food proteins(Float proteins) {
        this.proteins = proteins;
        return this;
    }

    public void setProteins(Float proteins) {
        this.proteins = proteins;
    }

    public Float getCarbs() {
        return this.carbs;
    }

    public Food carbs(Float carbs) {
        this.carbs = carbs;
        return this;
    }

    public void setCarbs(Float carbs) {
        this.carbs = carbs;
    }

    public Float getFats() {
        return this.fats;
    }

    public Food fats(Float fats) {
        this.fats = fats;
        return this;
    }

    public void setFats(Float fats) {
        this.fats = fats;
    }

    public Set<Meal> getMeals() {
        return this.meals;
    }

    public Food meals(Set<Meal> meals) {
        this.setMeals(meals);
        return this;
    }

    public Food addMeal(Meal meal) {
        this.meals.add(meal);
        meal.setFood(this);
        return this;
    }

    public Food removeMeal(Meal meal) {
        this.meals.remove(meal);
        meal.setFood(null);
        return this;
    }

    public void setMeals(Set<Meal> meals) {
        if (this.meals != null) {
            this.meals.forEach(i -> i.setFood(null));
        }
        if (meals != null) {
            meals.forEach(i -> i.setFood(this));
        }
        this.meals = meals;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Food)) {
            return false;
        }
        return id != null && id.equals(((Food) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Food{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", calories=" + getCalories() +
            ", proteins=" + getProteins() +
            ", carbs=" + getCarbs() +
            ", fats=" + getFats() +
            "}";
    }
}

/* eslint-disable max-classes-per-file */
class User {
  constructor(name) {
    this.name = name;
  }
}

class UserBuilder {
  constructor(name) {
    this.user = new User(name);
  }

  setAge(age) {
    this.user.age = age;
    return this;
  }

  setCity(city) {
    this.user.city = city;
    return this;
  }

  build() {
    return this.user;
  }
}

const u = new UserBuilder('Divesh').setAge(24).setCity('Jaipur').build();

console.log(u);

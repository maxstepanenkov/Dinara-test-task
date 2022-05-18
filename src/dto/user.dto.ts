export class UserDto {
  email;
  id;
  name;
  isActivated;

  constructor(model: any) {
    this.name = model.name;
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
  }
};
import { AdminModel } from "../models/admin.model"

class AdminService {
  async findByEmail (email: string) {
    return AdminModel.findOne({ email });
  }

  create(admin:any){
    return AdminModel.create(admin)
  }
}

export default new AdminService()
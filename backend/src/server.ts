import app from "./app";
import { env } from "./config/env";
import { adminService } from "./services/admin.service";

app.listen(env.PORT, () => {
  console.log(`Server running on ${env.PORT}`);
  adminService.seed().catch(console.error);
});

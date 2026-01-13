import { getAllSheet1 } from "../controllers/sheet1Controller";

export const sheet1Routes = [
  {
    path: "/sheet1",
    method: "GET",
    handler: getAllSheet1,
  },
//   {
//     path: "/patients",
//     method: "GET",
//     handler: getPatients,
//   },
];

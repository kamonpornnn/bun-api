import { GetAllOPDVisits, AddOPDVisit } from "../controllers/OPDVisitController";

export const opdVisitsRoutes = [
  {
    path: "/opd-visits",
    method: "GET",
    handler: GetAllOPDVisits,
  },
  {
    path: "/opd-visits",
    method: "POST",
    handler: AddOPDVisit,
  },
];

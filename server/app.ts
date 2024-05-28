import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";
import ServiceConcept from "./concepts/services";
import ConsentRecordConcept from "./concepts/consentrecord";
import TraceabilityConcept from "./concepts/traceability";
import DataSharingConcept from "./concepts/datasharing";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Service = new ServiceConcept();
export const ConsentRecord = new ConsentRecordConcept();
export const Traceability = new TraceabilityConcept();
export const DataSharing = new DataSharingConcept();

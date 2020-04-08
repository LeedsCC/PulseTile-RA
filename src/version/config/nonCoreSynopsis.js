import { faCommentMedical, faUserMd, faAddressBook } from '@fortawesome/free-solid-svg-icons';

import { synopsisLeedsServicesAction, synopsisTopThreeThingsAction, synopsisNhsServicesAction } from "../actions/synopsisActions";

export const nonCoreSynopsisActions = [
    synopsisLeedsServicesAction,
    synopsisTopThreeThingsAction,
    synopsisNhsServicesAction
];

export const nonCoreSynopsisData = [
    // { id: "block-vaccinations", title: "Vaccinations", list: "vaccinations", icon: faSyringe, isActive: true },
    { id: "block-top3Things", title: "Top Three Things", list: "top3Things", icon: faUserMd, isActive: true },
    { id: "block-nhsServices", title: "NHS Resources", list: "nhs-resources", icon: faAddressBook, isActive: true },
    { id: "block-leedsServices", title: "Health and Advice", list: "health-and-advice", icon: faCommentMedical, isActive: true, listOnly: true }
];
export enum InfoMessage {

    finishedVerification = 1, // invalid email address
    invalidEmailStructure = 2, // email structure is invalid
    noMxRecords = 3, // no mx record found
    SMTPConnectionTimeout = 4, // timeout
    domainNotFound = 5, // domain not found
    SMTPConnectionError = 6 // smtp connection
}

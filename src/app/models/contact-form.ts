import {ContactType} from './contact-type.enum';

export interface ContactForm {
    contactType:ContactType;
    comment:string;
}

import { Schema, model } from 'mongoose';
import { contactList } from '../../constans/contactList.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
      required: true,
    },
    contactType: {
      type: String,
      enum: contactList,
      required: true,
      default: 'personal',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    photo: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const ContactCollection = model('contact', contactSchema);

export const contactsSortField = [
  'name',
  'phoneNumber',
  'email',
  'isFavourite',
  'contactType',
];

export default ContactCollection;

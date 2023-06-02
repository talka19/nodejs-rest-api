const {Schema, model} = require('mongoose');
const {handleMongooseError} = require('../helpers');
const Joi = require("joi");

const contactSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
}, {versionKey: false, timestamps: true});

contactSchema.post("save", handleMongooseError);

const addSchema = Joi.object().custom((value, helpers) => {
    if (Object.keys(value).length === 0) {
      return helpers.error('object.empty');
    }
    
    const keys = ['name', 'email', 'phone', 'favorite'];
    const missingKeys = keys.filter(key => !Object.prototype.hasOwnProperty.call(value, key));
    
    if (missingKeys.length > 0) {
      return helpers.error('object.missingKeys', { missingKeys });
    }
    
    return value;
  }).messages({
    'object.empty': 'missing fields',
    'object.missingKeys': 'missing required fields: {{#missingKeys}}',
});

const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required().messages({
      'any.required': 'missing field favorite',
  }),
})

const schemas = {
    addSchema,
    updateFavoriteSchema,
}

const Contact = model('contacts', contactSchema);

module.exports = {
    Contact,
    schemas,
};
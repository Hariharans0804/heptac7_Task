import * as Yup from 'yup';

export const buildSchema = (fields) => {
    return Yup.object().shape(
        fields.reduce((schema, field) => {
            let validator;

            switch (field.type) {
                case 'text':
                case 'dropdown':
                    validator = Yup.string();
                    if (field.required) {
                        validator = validator.required(`${field.label} is required`);
                    }
                    break;

                case 'date':
                    validator = Yup.date().nonNullable();
                    if (field.required) {
                        validator = validator.required(`${field.label} is required`);
                    }
                    break;

                case 'radio':
                    validator = Yup.string();
                    if (field.required) {
                        validator = validator.required(`${field.label} is required`);
                    }
                    break;

                case 'checkbox':
                    validator = Yup.array();
                    if (field.required) {
                        validator = validator.min(1, `Select at least one ${field.label}`);
                    }
                    break;

                default:
                    validator = Yup.mixed();
            }

            schema[field.key] = validator;
            return schema;
        }, {})
    );
};
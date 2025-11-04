import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { buildSchema } from '../../../utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Colors, Fonts } from '../../../constants';
import { FormInputs } from '../../../components';

const AddUserScreen = ({ route, navigation }) => {

    const { fields, title, data, onSubmit } = route.params;

    const schema = buildSchema(fields);

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: fields.reduce((acc, field) => {
            // for checkbox -> array
            if (field.type === 'checkbox') {
                acc[field.key] = data?.[field.key] ?? [];
            } else if (field.type === 'date') {
                acc[field.key] = data?.[field.key] ? new Date(data[field.key]) : null;
            } else {
                acc[field.key] = data?.[field.key] ?? '';
            }
            return acc;
        }, {}),
        resolver: yupResolver(schema),
    });

    const handleFormSubmit = (formData) => {

        // if there's a date object, format it
        if (formData.dateofbirth instanceof Date) {
            // "2025-11-04" format
            formData.dateofbirth = formData.dateofbirth.toISOString().split('T')[0];
            // or: formData.dateofbirth = formData.dateofbirth.toDateString();
        }

        onSubmit(formData);
        navigation.goBack();
    };


    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>
                {data?._id ? `Edit ${title}` : `Create ${title}`}
            </Text>

            {fields.map((field) => (
                <FormInputs
                    key={field.key}
                    control={control}
                    name={field.key}
                    label={field.label}
                    placeholder={field.placeholder}
                    errors={errors}
                    type={field.type}
                    options={field.options || []}
                />
            ))}

            <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit(handleFormSubmit)}
            >
                <Text style={styles.buttonText}>
                    {data?._id ? `Update ${title}` : `Add ${title}`}
                </Text>
            </TouchableOpacity>

        </ScrollView>
    )
}

export default AddUserScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.DEFAULT_WHITE,
        padding: 20,
        // borderWidth:1,
        // borderColor:'red'
    },
    heading: {
        fontSize: 20,
        lineHeight: 20 * 1.4,
        fontFamily: Fonts.POPPINS_SEMI_BOLD,
        marginBottom: 20,
        color: Colors.DEFAULT_SKY_BLUE
    },
    button: {
        backgroundColor: Colors.DEFAULT_SKY_BLUE,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 50,
        marginHorizontal: 30
    },
    buttonText: {
        color: Colors.DEFAULT_WHITE,
        fontSize: 16,
        lineHeight: 16 * 1.4,
        fontFamily: Fonts.POPPINS_SEMI_BOLD,
    }
})
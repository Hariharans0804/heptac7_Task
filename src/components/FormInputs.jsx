import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Switch,
} from 'react-native';
import { Controller } from 'react-hook-form';
import DatePicker from 'react-native-date-picker';
import { Dropdown } from 'react-native-element-dropdown';

const FormInputs = ({
    control,
    name,
    label,
    placeholder,
    errors,
    type,
    options = [],
}) => {
    const [openDate, setOpenDate] = useState(false);

    // helper to show error of this field
    const errorMessage = errors?.[name]?.message;

    const today = new Date();
    const minDate = new Date(today.getFullYear() - 80, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());


    // ---------- TEXT INPUT ----------
    if (type === 'text') {
        return (
            <View style={styles.fieldContainer}>
                <Text style={styles.label}>{label}</Text>
                <Controller
                    control={control}
                    name={name}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[
                                styles.input,
                                errorMessage ? styles.inputError : null,
                            ]}
                            placeholder={placeholder}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            </View>
        );
    }

    // ---------- DATE PICKER ----------
    if (type === 'date') {
        return (
            <View style={styles.fieldContainer}>
                <Text style={styles.label}>{label}</Text>
                <Controller
                    control={control}
                    name={name}
                    render={({ field: { onChange, value } }) => (
                        <>
                            <TouchableOpacity
                                style={[
                                    styles.input,
                                    styles.dateInput,
                                    errorMessage ? styles.inputError : null,
                                ]}
                                onPress={() => setOpenDate(true)}
                            >
                                <Text>
                                    {value ? new Date(value).toDateString() : placeholder}
                                </Text>
                            </TouchableOpacity>


                            <DatePicker
                                modal
                                open={openDate}
                                date={value ? new Date(value) : maxDate}
                                minimumDate={minDate}
                                maximumDate={maxDate}
                                onConfirm={(date) => {
                                    setOpenDate(false);
                                    onChange(date);
                                }}
                                onCancel={() => setOpenDate(false)}
                            />

                        </>
                    )}
                />
                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            </View>
        );
    }

    // ---------- DROPDOWN ----------
    if (type === 'dropdown') {
        return (
            <View style={styles.fieldContainer}>
                <Text style={styles.label}>{label}</Text>
                <Controller
                    control={control}
                    name={name}
                    render={({ field: { onChange, value } }) => (
                        <Dropdown
                            style={[
                                styles.dropdown,
                                errorMessage ? styles.inputError : null,
                            ]}
                            data={options}
                            labelField="label"
                            valueField="value"
                            placeholder={placeholder}
                            value={value}
                            onChange={(item) => {
                                onChange(item.value);
                            }}
                        />
                    )}
                />
                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            </View>
        );
    }

    // ---------- RADIO ----------
    if (type === 'radio') {
        return (
            <View style={styles.fieldContainer}>
                <Text style={styles.label}>{label}</Text>
                <Controller
                    control={control}
                    name={name}
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.radioGroup}>
                            {options.map((opt) => (
                                <TouchableOpacity
                                    key={opt.value}
                                    style={styles.radioRow}
                                    onPress={() => onChange(opt.value)}
                                >
                                    <View
                                        style={[
                                            styles.radioOuter,
                                            value === opt.value && styles.radioOuterActive,
                                        ]}
                                    >
                                        {value === opt.value && <View style={styles.radioInner} />}
                                    </View>
                                    <Text>{opt.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                />
                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            </View>
        );
    }

    // ---------- CHECKBOX (multiple select) ----------
    if (type === 'checkbox') {
        return (
            <View style={styles.fieldContainer}>
                <Text style={styles.label}>{label}</Text>
                <Controller
                    control={control}
                    name={name}
                    render={({ field: { onChange, value = [] } }) => (
                        <View style={styles.checkboxGroup}>
                            {options.map((opt) => {
                                const checked = value.includes(opt.value);
                                return (
                                    <TouchableOpacity
                                        key={opt.value}
                                        style={styles.checkboxRow}
                                        onPress={() => {
                                            let newArr = [];
                                            if (checked) {
                                                newArr = value.filter((v) => v !== opt.value);
                                            } else {
                                                newArr = [...value, opt.value];
                                            }
                                            onChange(newArr);
                                        }}
                                    >
                                        <View
                                            style={[
                                                styles.checkboxBox,
                                                checked && styles.checkboxBoxChecked,
                                            ]}
                                        />
                                        <Text>{opt.label}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                />
                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            </View>
        );
    }

    // fallback
    return null;
};



const styles = StyleSheet.create({
    fieldContainer: {
        marginBottom: 16,
    },
    label: {
        fontWeight: '500',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    inputError: {
        borderColor: 'red',
    },
    error: {
        color: 'red',
        marginTop: 4,
    },
    dateInput: {
        justifyContent: 'center',
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 12,
        height: 48,
    },
    radioGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    radioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        marginBottom: 6,
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderWidth: 1.5,
        borderColor: '#555',
        borderRadius: 10,
        marginRight: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOuterActive: {
        borderColor: '#007bff',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#007bff',
    },
    checkboxGroup: {
        gap: 6,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    checkboxBox: {
        width: 20,
        height: 20,
        borderWidth: 1.5,
        borderColor: '#555',
        borderRadius: 4,
    },
    checkboxBoxChecked: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
});

export default FormInputs;


{/* <DatePicker
                                modal
                                open={openDate}
                                date={value ? new Date(value) : new Date()}
                                mode="date"
                                onConfirm={(date) => {
                                    setOpenDate(false);
                                    onChange(date);
                                }}
                                onCancel={() => setOpenDate(false)}
                            /> */}
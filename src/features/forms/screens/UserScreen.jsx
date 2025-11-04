import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Fonts } from '../../../constants'
import Toast from 'react-native-toast-message';
import { createUserAPI, updateUserAPI, deleteUserAPI } from '../api/formApi'
import { Eye, Pencil, Trash2 } from 'lucide-react-native';

const formFields = [
  {
    key: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
    required: true
  },
  {
    key: "dateofbirth",
    label: "Date of Birth",
    type: "date",
    placeholder: "Select your date of birth",
    required: true
  },
  {
    key: "gender",
    label: "Gender",
    type: "radio",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
    ],
    placeholder: "Select your gender",
    required: true
  },
  {
    key: "qualification",
    label: "Highest Qualification",
    type: "dropdown",
    options: [
      { label: "High School", value: "highschool" },
      { label: "Bachelor's Degree", value: "bachelor" },
      { label: "Master's Degree", value: "master" },
      { label: "PhD", value: "phd" },
    ],
    placeholder: "Select your highest qualification",
    required: true
  },
  {
    key: "skills",
    label: "Skills",
    type: "checkbox",
    options: [
      { label: "JavaScript", value: "javascript" },
      { label: "Python", value: "python" },
      { label: "Java", value: "java" },
      { label: "C++", value: "cpp" },
    ],
    placeholder: "Select your skills",
    required: true
  },
];

const UserScreen = ({ navigation }) => {

  const dummy = [
    { id: 1, name: "Jhon Doe", dob: "01-01-1990", gender: "male", qualification: "bachelor", skills: ["javascript", "c++"] },
    { id: 2, name: "Francies", dob: "10-11-1790", gender: "male", qualification: "highschool", skills: ["python", "c++"] },
    { id: 3, name: "Jhon Doe", dob: "01-01-1990", gender: "male", qualification: "bachelor", skills: ["javascript", "java"] },
  ];

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 for ActivityIndicator

  useEffect(() => {
    const test = async () => {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
        const data = await res.json();
        console.log('✅ Internet OK:', data);
      } catch (e) {
        console.log('❌ Internet Problem:', e);
      }
    };
    test();
  }, []);

  // load users (for now use dummy)
  useEffect(() => {
    // simulate API
    setTimeout(() => {
      setUsers(dummy);
      setLoading(false);
    }, 500);
  }, []);

  const handleUserSubmit = async (formData) => {
    console.log('AddUser', formData);
    try {
      if (formData?.id) {
        await updateUserAPI(formData._id, formData);
        Toast.show({ type: "success", text1: "User updated successfully!" });
      } else {
        await createUserAPI(formData);
        Toast.show({ type: "success", text1: "User created successfully!" });
      }

      // fetchUsersAPI();  // refresh list
    } catch (error) {
      console.error("Failed to save user:", error);
      Toast.show({
        type: "error",
        text1: "User save failed!",
        text2: "Please try again.",
      });
    }
  }


  const handleDeleteUser = async (item) => {
    try {
      await deleteUserAPI(item._id);
      Toast.show({ type: "success", text1: "User deleted successfully!" });
      // fetchUsers();  // refresh list
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Delete failed!",
        text2: error.message || "Please try again.",
      });
    }
  }

  const handleEditUser = (item) => {
    navigation.navigate("AddUser", {
      fields: formFields,
      title: "Edit New User",
      data: item,
      onSubmit: handleUserSubmit,
    })
  };

  const handleAddUser = () => {
    navigation.navigate("AddUser", {
      fields: formFields,
      title: "Add New User",
      data: {},
      onSubmit: handleUserSubmit,
    })
  };


  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 1 }]}>{index + 1}</Text>
      <Text style={[styles.cell, { flex: 3 }]}>{item.name}</Text>
      <Text style={[styles.cell, { flex: 3 }]}>
        {item.gender ? item.gender : "-"}
      </Text>
      <View style={[styles.cell, styles.actions, { flex: 2 }]}>
        <TouchableOpacity /*onPress={() => handleView(item)}*/ style={styles.iconBtn}>
          <Eye size={18} color="#2563eb" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEditUser(item)} style={styles.iconBtn}>
          <Pencil size={18} color="#16a34a" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteUser(item)} style={styles.iconBtn}>
          <Trash2 size={18} color="#dc2626" />
        </TouchableOpacity>
      </View>
    </View>
  );


  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headingText}>User Form</Text>
        <TouchableOpacity style={styles.createButton} onPress={handleAddUser}>
          <Text style={styles.createText}>Create</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeading, { flex: 1 }]}>No</Text>
        <Text style={[styles.tableHeading, { flex: 3 }]}>Name</Text>
        <Text style={[styles.tableHeading, { flex: 3 }]}>Mobile</Text>
        <Text style={[styles.tableHeading, { flex: 2 }]}>Status</Text>
      </View>


      {loading ? (
        <ActivityIndicator
          size='large'
          color={Colors.DEFAULT_SKY_BLUE}
          style={{ marginTop: 20, }}
        />
      ) : users.length === 0 ? (
        <View style={styles.centerBox}>
          <Text style={{ color: "#666" }}>No users found.</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

    </View>
  )
}

export default UserScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.DEFAULT_WHITE
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.DEFAULT_LIGHT_GRAY,
    marginHorizontal: 16,
    marginVertical: 8
  },
  headingText: {
    fontSize: 18,
    lineHeight: 18 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_SKY_BLUE
  },
  createButton: {
    backgroundColor: Colors.DEFAULT_SKY_BLUE,
    borderRadius: 8,
    padding: 8
  },
  createText: {
    fontSize: 16,
    lineHeight: 16 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_WHITE
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    borderColor: Colors.DEFAULT_LIGHT_BLUE,
    backgroundColor: Colors.DEFAULT_SKY_BLUE,
    borderRadius: 8
  },
  tableHeading: {
    // flex: 1,
    fontFamily: Fonts.POPPINS_MEDIUM,  // Change to the correct font if needed
    fontSize: 14,
    lineHeight: 14 * 1.4,
    textAlign: 'center',
    color: Colors.DEFAULT_WHITE,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
  },
  cell: {
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6, // if your RN version doesn’t support gap, remove this and keep marginRight
  },
  iconBtn: {
    padding: 4,
    marginHorizontal: 2,
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
import { createStackNavigator } from "@react-navigation/stack";
import { AddUserScreen, UserScreen } from "../features/forms/screens";


const Stack = createStackNavigator();

const RootNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="User" component={UserScreen} />
            <Stack.Screen name="AddUser" component={AddUserScreen} />
        </Stack.Navigator>
    );
}

export default RootNavigator
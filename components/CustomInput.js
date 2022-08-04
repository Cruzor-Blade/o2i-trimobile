import React from 'react';
import { TextInput, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const CustomInput = ({IconComponent, value, placeholder, onChangeText, secureTextEntry, keyboardType, onIconPress}) => {
    return (
        <View style={styles.inputContainer}>
            <TouchableWithoutFeedback onPress={onIconPress}>
                <View style={styles.iconContainer}>
                    <IconComponent/>
                </View>
            </TouchableWithoutFeedback>
            <TextInput
                keyboardType={keyboardType}
                value={value}
                placeholder={placeholder}
                onChangeText={onChangeText}
                style={styles.textInput}
                secureTextEntry={secureTextEntry}
            />
        </View>
    )
};

export default CustomInput;

const styles = StyleSheet.create({
    inputContainer:{
        width:'95%',
        alignSelf:'center',
        alignItems:'center',
        flexDirection:'row'
    },
    iconContainer:{
        height:50,
        width:50,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#fff',
        borderColor:'rgba(71, 167, 42, 0.7)',
        borderBottomLeftRadius:8,
        borderTopLeftRadius:8,
        borderWidth:1
    },
    textInput:{
        color:'#000000',
        height:50,
        borderTopRightRadius:8,
        borderBottomRightRadius:8,
        borderWidth:1,
        borderColor:'rgba(71, 167, 42, 0.7)',
        borderLeftWidth:0,
        marginVertical:5,
        paddingHorizontal:10,
        justifyContent:'center',
        backgroundColor:'#fff',
        flex:1
    },
    logger: {
        height:45,
        width:'95%',
        backgroundColor:'#1C7D2D',
        paddingHorizontal:30,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        marginVertical:40
    }
})
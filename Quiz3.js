/*
  MathQuiz.js - this component will generate arithmetic questions
  and ask the user to solve them. It keeps track of the number they
  got right and the total number of questions they answered.
  It generates random numbers in the range 0 to n for products
*/
import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';


const MathQuiz = ({n}) => {
  const [x, setX] = useState(Math.round(Math.random()*n));
  const [y, setY] = useState(Math.round(Math.random()*n));
  const [correct, setCorrect] = useState(0); 
  const [radius,setRadius] = useState('')
  const [height,setHeight] = useState('')
  const [result,setResult] = useState('waiting')
  const [answered,setAnswered] = useState(0)
  const [debugging,setDebugging] = useState(false)
  const [ans, setAns] = useState('')

  useEffect(() => {getData()}
           ,[])

  useEffect(() => {
    storeData({correct,answered})
  },[correct,answered])

  let debugView = ""
  if (debugging) {
    debugView =
      <View>
          <Text> radius = {radius} inches </Text>
          <Text> height = {height} inches</Text>
          <Text> area of base = pi*r^2 = {Math.PI * radius*radius} square inches</Text>
          <Text> volume of cylinder = {Math.PI * radius*radius * height} cubic inches </Text>
          <Text> volume of cylinder = {((Math.PI * radius*radius * height) / 231).toFixed(2)} gallons </Text>
      </View>
  }

  let responseView = (<View></View>)

  if (result=="waiting") {
    responseView = (
      <Button
          color="green"
          title="CALCULATE VOLUME"
          onPress={()=> {
            let a = parseInt(radius)
            let b = parseInt(height)
            let answer = (Math.PI * a*a * b) / 231
            setAns(answer.toFixed(2) + ' gallons')

          }}
      />
    )
  } else {
    responseView =  (
      <View style={
         {
          flexDirection:'column',
          alignItems:'center',
          justifyContent:'space-around'}}>
          <Text style={{fontSize:32,color:'red'}}>
            {result=='correct'?"Correct!!":`Sorry, answer was ${x*y}, try again!`}
          </Text>

          <Button
                color='green'
                title='Next Question???'
                onPress = {() => {
                  setX(Math.round(Math.random()*n))
                  setY(Math.round(Math.random()*n))
                  setResult('waiting')
                  setAnswer('')
                }}

            />
        </View>
      )
  }

  const storeData = async (value) => {
        try {
          const jsonValue = JSON.stringify(value)
          await AsyncStorage.setItem('@mathquiz', jsonValue)
        } catch (e) {
          console.dir(e)
        }
  }

  const getData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('@mathquiz')
          let data = null
          if (jsonValue!=null) {
            data = JSON.parse(jsonValue)
            setCorrect(data.correct)
            setAnswered(data.answered)
          } else {
            setCorrect(0)
            setAnswered(0)
          }
        } catch(e) {
          console.dir(e)
        }
  }

  const clearAll = async () => {
        try {
          await AsyncStorage.clear()
        } catch(e) {
          console.dir(e)
        }
  }


  return (
        <View style={{flex:1,justifyContent:'flex-start',alignItems:'flex-start'}}>
          <View style={{flexDirection: 'column', backgroundColor: '#90ee8f'}}>
            <Text style={{fontSize:60}}>
               Quiz 3
            </Text>
            <Text style={{fontSize:20}}>
              CS153a Fall 21
            </Text>
            <Text style={{fontSize:20}}>
             Write code for this App, including the text!
            </Text>
          </View>
          <Text>Enter the radius and height of a cylinder in inches and we wil calculate and we will calculate the volume in gallons. A 6 inch radius and 12 inch height will have a volume of 5.88. Divide cubic inches by 231 to get gallons, and show only 2 digits after the decimal point in volume. </Text>

          <View style={{flexDirection:'column', justifyContent:'space-around'}}>
            <View style={{flexDirection: 'row', backgroundColor:'#fec0ca'}}>
              <Text style={{fontSize:20,}}>radius:</Text>
              <TextInput
                onChangeText={text => {setRadius(text)}}
                value={radius}
                placeholder={''}
                keyboardType="numeric"
              />
            </View>
            <View style={{flexDirection: 'row', backgroundColor:'#fec0ca'}}>
              <Text style={{fontSize:20}}>height:</Text>
              <TextInput
                onChangeText={text => {setHeight(text)}}
                value={height}
                placeholder={''}
                keyboardType="numeric"
              />
            </View>
          </View>

          {responseView}

          <View style={{flex:1}}>
              <View style={{ backgroundColor:'#fec0ca'}}>
                <Text> The answer is {ans}</Text>
              </View>

              <Button
                  title={'TOGGLE CALCULATIONS VIEW'}
                  color="dodgerblue"
                  onPress = {() => setDebugging(!debugging)}
                  />
                  {debugView}
          </View>
        </View>
      );
    }
  const styles = StyleSheet.create ({
    container: {
      flex: 1,
      flexDirection:'column',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      border: "thick solid red",
      margin:"20px",
      padding:"20px",
    },
    textinput:{
      margin:20,
      fontSize:20
    },
    header: {
      fontSize:40,
      color:'blue'
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default MathQuiz;

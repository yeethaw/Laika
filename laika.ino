#include <Servo.h>                           // Include servo library

Servo servoRight;
Servo servoLeft;

void forwards(int timee){
  servoLeft.writeMicroseconds(1700);
  servoRight.writeMicroseconds(1300);
  delay(timee);
}

void backwards(int timee){
  servoLeft.writeMicroseconds(1300);
  servoRight.writeMicroseconds(1700);
  delay(timee);
}

void turn_left(int timee){
  servoLeft.writeMicroseconds(1300);
  servoRight.writeMicroseconds(1300);
  delay(timee);
}

void turn_right(int timee){
  servoLeft.writeMicroseconds(1700);
  servoRight.writeMicroseconds(1700);
  delay(timee);
}

void stopp (int delayy) {
  // Your Code Here
  servoLeft.writeMicroseconds(1500);        
  servoRight.writeMicroseconds(1500);
  delay(delayy);
}

int trigPin = 2;    // Trigger
int echoPin = 3;    // Echo
long duration, cm, inches;

void setup()
{
  servoLeft.attach(13);                      
  servoRight.attach(12); 
  //Serial Port begin
  Serial.begin (9600);
  //Define inputs and outputs
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}



void loop()
{
  digitalWrite(trigPin, LOW);
  delayMicroseconds(5);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
 
  // Read the signal from the sensor: a HIGH pulse whose
  // duration is the time (in microseconds) from the sending
  // of the ping to the reception of its echo off of an object.
  pinMode(echoPin, INPUT);
  duration = pulseIn(echoPin, HIGH);
 
  // Convert the time into a distance
  cm = (duration/2) / 29.1;     // Divide by 29.1 or multiply by 0.0343
  inches = (duration/2) / 74;   // Divide by 74 or multiply by 0.0135
  
  Serial.print(inches);
  Serial.print("in, ");
  Serial.print(cm);
  Serial.print("cm");
  Serial.println();
  
  delay(250);

  if (cm <= 19 ){
    backwards(500);
    Serial.println("too close!");
  }

  else if (cm == 20){
    stopp(500);
    Serial.println("stop");
  }

  else if( cm >= 21 && cm <= 60) {
    forwards(500);
    Serial.println("too far!");
  }
 
}

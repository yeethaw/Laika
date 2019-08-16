#include <Servo.h>                           // Include servo library

Servo servoRight;
Servo servoLeft;

void forwards(int time){
  servoLeft.writeMicroseconds(1700);
  servoRight.writeMicroseconds(1300);
  delay(time);
}

void backwards(int time){
  servoLeft.writeMicroseconds(1300);
  servoRight.writeMicroseconds(1700);
  delay(time);
}

void turn_left(int time){
  servoLeft.writeMicroseconds(1300);
  servoRight.writeMicroseconds(1300);
  delay(time);
}

void turn_right(int time){
  servoLeft.writeMicroseconds(1700);
  servoRight.writeMicroseconds(1700);
  delay(time);
}

#define trigpin 2
#define echopin 3
int m11=4;
int m12=5;
int m21=6;
int m22=7;
void setup()
{
  pinMode(m11,OUTPUT);
  pinMode(m12,OUTPUT);
  pinMode(m21,OUTPUT);
  pinMode(m22,OUTPUT);
  pinMode(trigpin,OUTPUT);
  pinMode(echopin,INPUT);
  servoLeft.attach(13);
  servoRight.attach(12);
}
void loop()
{
  int duration,distance;
  digitalWrite(trigpin,HIGH);
  delayMicroseconds(1000);
  digitalWrite(trigpin,LOW);
  duration=pulseIn(echopin,HIGH);
  distance=(duration/2)/29.1;
  if(distance>=40)
  {
    digitalWrite(m11,LOW);
    digitalWrite(m11,LOW);
    digitalWrite(m11,LOW);
    digitalWrite(m11,LOW);
    delay(500);
    
    
  }
 else
  {
    if(distance>=25)
    {
    digitalWrite(m11,HIGH);
    digitalWrite(m11,LOW);
    digitalWrite(m11,HIGH);
    digitalWrite(m11,LOW);
    delay(400);
    
    
  }
  else
 {
  
    digitalWrite(m11,LOW);
    digitalWrite(m11,HIGH);
    digitalWrite(m11,LOW);
    digitalWrite(m11,HIGH);
    delay(400);
  }
 }
}

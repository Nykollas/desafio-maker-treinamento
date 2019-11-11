#include <stdio.h> 
#define MAX 100 
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <time.h>

ESP8266WiFiMulti WiFiMulti;

void connect()
{
  char* ssid = "TP-LINK_2A7F40"; 
  char* pass = ""; 
  
  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(ssid, pass);
}

void setup() {
  pinMode(A0, INPUT);
  Serial.begin(9600);
  connect();
}

void loop() {
   if ((WiFiMulti.run() == WL_CONNECTED)) {



    HTTPClient https;
    
    if (https.begin("https://autobots-8c357.firebaseio.com/teste/dado.json","B6:F5:80:C8:B1:DA:61:C1:07:9D:80:42:D8:A9:1F:AF:9F:C8:96:7D")) { 

      float res = analogRead(A0);
      char buf[MAX];
      char val[MAX];
      
      char* str_timestamp;
      time_t rawtime;
      struct tm * timeinfo;
      timeinfo = localtime ( &rawtime );
      str_timestamp = asctime(timeinfo);
      char* ptr = strchr(str_timestamp, '\n');
      if( ptr != NULL)
        *ptr = '\0';
      
      gcvt(res, 6, val); 
      
      strcat(buf, "{\"value\":\"");
      strcat(buf, val);
      strcat(buf, "\",\"timestamp\":\"");
      strcat(buf, str_timestamp);
      strcat(buf, "\"}");
      
      Serial.printf("%s", buf);
      int httpCode = https.PUT(buf);
      Serial.println(httpCode);
      if (httpCode > 0) {
        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          String payload = https.getString();
          Serial.println(payload);
        }
      } else {
        Serial.printf(https.errorToString(httpCode).c_str());
        Serial.printf("\n");
      }

      https.end();
      
    } else {
      Serial.printf("[HTTPS] Unable to connect\n");
    }
  }

  delay(10000);
}
  

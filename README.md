# SISYPHUS Global Systems

We have built a web portal that utilizes ArcGIS maps and WebXR to provide different users (in the pilot city of New Orleans) with an immersive augmented reality experience of assessing their properties' flood risks, and viewing their city's green and grey infrastructure. Currently, our immersive experiences are provided as demonstrations, but eventually, we hope to complete the back end code to enable automated predictions of flood risk for individual properties and a 3D rendered map of city infrastructure, which will be useful for individual home owners as well as officials such as city planners to implement flood mitigation strategies.   

Our web-app comprises of the following pages:
1) A home page for a user to submit their house address to assess the flood risk
2) A New Orleans Green-Grey Infrastructure Page map: This map curated by our team's GIS experts displays the current state of New Orleans green and grey infrastructure. Users can also overlay a flood risk map to visualize how the presence (or lack) of appropriate green and grey infrastructure minimizes (or enhances) flood inundation risk. 
3) AR Map Demo: In this immersive-ar demo, users are able to render the flood risk map for New Orleans onto a lot surface to visualize it interactively.
4) AR Home Demo: In this demo, a user is able to visualize how our app  will provide predictions for their property's flood risk. 

## The following steps are required to run our application: 
A) Using Code Engine: 
Docker image: docker.io/uqktiwar/sisyphus:latest
code engine app URL: https://app-e3.cml40ggv51o.jp-osa.codeengine.appdomain.cloud/ 

B) In case our code engine deployment fails, please follow the following steps to deploy the website: 
1) Install dependencies: python-3, django

2) Clone the github repo: https://github.com/trungvu08/CFC_SISYPHUS_Global_Systems.git

3) CD into the repository: cd CFC_SISYPHUS_Global_Systems

4) run the following cmd in terminal: python manage.py runserver

5) The application will be hosted at http://127.0.0.1:8000/

6) Configure browser to use WebXR: 
To be able to run the AR pages on your desktop browser install the WebXR Emulator extension for Chrome browsers. A handy description is provided here: https://blog.mozvr.com/webxr-emulator-extension/

## To learn more about SISYPHUS, please visit our [website](https://sisyphus-gs.com/).

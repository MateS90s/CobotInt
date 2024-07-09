import ROSLIB from 'roslib';

export default class LbrTopics {
  constructor(ros) {
    this.ros = ros;
    this.jointTrajectoryPublisher = null;
    this.jointStatesListener = null;
    this.jointStatesCallbacks = [];

    this.initializePublishers();
    this.initializeListeners();
  }


//Inicjalizacje - nadanie formy wiadomości
  initializePublishers = () => {
    if (this.ros) {
      this.jointTrajectoryPublisher = new ROSLIB.Topic({
        ros: this.ros,
        name: '/lbr/joint_trajectory_controller/joint_trajectory',
        messageType: 'trajectory_msgs/JointTrajectory',
      });
    } else {
      console.error('ROS connection not available. Unable to initialize publishers.');
    }
  }

  initializeListeners = () => {
    if (this.ros) {
      this.jointStatesListener = new ROSLIB.Topic({
        ros: this.ros,
        name: "/lbr/joint_states",
        messageType: "sensor_msgs/JointState",
      });
    } else {
      console.error('ROS connection not available. Unable to initialize listeners.');
    }
  }

//Publikowanie wartości do ROSa
  publishJointValues = (jointNames, positions) => {
    if (!this.jointTrajectoryPublisher) {
      console.error('Joint trajectory publisher not initialized. Unable to publish joint values.');
      return;
    }

    const message = new ROSLIB.Message({
      joint_names: jointNames,
      points: [{
        positions: positions,
        time_from_start: { sec: 2, nanosec: 0 } // Czas od początku trajektorii do osiągnięcia tej pozycji
      }]
    });

    try {
      this.jointTrajectoryPublisher.publish(message);
      console.log('Joint values published successfully:', positions);
    } catch (error) {
      console.error('Error publishing joint values:', error);
    }
  }


//Odbieranie wiadomości z ROSa
  subscribeToJointStates = (callback) => {
    if (!this.jointStatesListener) {
      console.error('Joint states listener not initialized. Unable to subscribe.');
      return () => {};
    }

    this.jointStatesCallbacks.push(callback); //dodanie funkcji z pilota setActualJointValues jako nowy element tablicy
   
    if (this.jointStatesCallbacks.length === 1) { //sprawdzenie czy lista callbackow jest równa 1, zeby stworzyć tylko jedną subskrypcję. I tak w pilocie na razie będize albo 0 albo 1 element - to że jest to tablica, to otwarcie tej biblioteki do pracy z większą ilością połączeń z ROSem lub np. dodać looger, caudie 3,5 o tym wspominał - doczytaj
      //TUTAJ KONIEC - pytanie do claudie o to co jak będą 2 callbacki lub więcej)
      this.jointStatesListener.subscribe(this.handleJointStatesMessage);
    }
    return () => this.unsubscribeFromJointStates(callback); //odsybksrybowanie które nie jest realizowane tylko wrzucane w pilocie do zmienne unsubscribe do przyszłego użytku
  }

  unsubscribeFromJointStates = (callback) => {
    this.jointStatesCallbacks = this.jointStatesCallbacks.filter(cb => cb !== callback);
    if (this.jointStatesCallbacks.length === 0 && this.jointStatesListener) {
      this.jointStatesListener.unsubscribe(this.handleJointStatesMessage);
    }
  }

  handleJointStatesMessage = (message) => {
    if (message && message.position) {
      this.jointStatesCallbacks.forEach(callback => callback(message.position));
    } else {
      console.error('Incorrect message structure:', message);
    }
  }
}
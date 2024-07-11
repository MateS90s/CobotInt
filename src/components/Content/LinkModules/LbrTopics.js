import ROSLIB from 'roslib';

export default class LbrTopics {
  constructor(ros) {
    this.ros = ros;
    this.jointTrajectoryPublisher = null;
    this.jointStatesListener = null;
    this.jointStatesCallbacks = [];
    this.isSubscribed = false;

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
   
    if (!this.isSubscribed) { 
      this.jointStatesListener.subscribe(this.handleJointStatesMessage);
      this.isSubscribed = true;
    }

    return () => this.unsubscribeFromJointStates(callback); //odsubksrybowanie które nie jest realizowane tylko wrzucane w pilocie do zmienne unsubscribe do przyszłego użytku
  }

  unsubscribeFromJointStates = (callback) => {
    this.jointStatesCallbacks = this.jointStatesCallbacks.filter(cb => cb !== callback);
    if (this.jointStatesCallbacks.length === 0 && this.isSubscribed) {
      this.jointStatesListener.unsubscribe(this.handleJointStatesMessage);
      this.isSubscribed= false;
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
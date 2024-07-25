import ROSLIB from 'roslib';

export default class LbrTopics {
  constructor(ros) {
    this.ros = ros;
    this.jointTrajectoryPublisher = null;
    this.jointStatesListener = null;
    this.motionPlanRequestPublisher = null;
    this.moveGroupServiceClient = null;
    this.jointStatesCallbacks = [];
    this.isSubscribed = false;

    this.initializePublishers();
    this.initializeListeners();
    this.initializeServices();
  }

  //Publisher - inicjaliacja - nadanie formy wiadomości
  initializePublishers = () => {
    if (this.ros) {
      //Topic do wysyłania prostego ruchu przegubów
      this.jointTrajectoryPublisher = new ROSLIB.Topic({
        ros: this.ros,
        name: '/lbr/joint_trajectory_controller/joint_trajectory',
        messageType: 'trajectory_msgs/msg/JointTrajectory',
      });

      //Topic do planowania ruchu
      this.motionPlanRequestPublisher = new ROSLIB.Topic({
        ros: this.ros,
        name: '/lbr/motion_plan_request',
        messageType: 'moveit_msgs/msg/MotionPlanRequest'
      });

    } else {
      console.error('ROS connection not available. Unable to initialize publishers.');
    }
  }

  //Subskrybcja - inicjalizacja - nadanie formy wiadomości 
  initializeListeners = () => {
    if (this.ros) {
      //Topic do subskrybcji pozycji przegubów
      this.jointStatesListener = new ROSLIB.Topic({
        ros: this.ros,
        name: "/lbr/joint_states",
        messageType: "sensor_msgs/msg/JointState",
      });

    } else {
      console.error('ROS connection not available. Unable to initialize listeners.');
    }
  }

  // Usługi - inicjalizacja - nadanie formy usługi 
  initializeServices = () => {
    if (this.ros) {
      this.moveGroupServiceClient = new ROSLIB.Service({
        ros: this.ros,
        name: '/lbr/move_group',
        serviceType: 'moveit_msgs/srv/MoveGroup'
      });
    }
  }

  //Publikowanie prostego ruchu przegubów do ROSa
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

  //PLAN i EXECUTE
  planAndExecuteMotion = (jointNames, targetPositions, currentPositions) => {
    if (!this.motionPlanRequestPublisher) {
      console.error('Motion plan request publisher not initialized.');
      return;
    }
    
    //Parametryzacja ruchu w planerze
    const request = new ROSLIB.Message({
      workspace_parameters: {
        header: { frame_id: 'world' },
        min_corner: { x: -1, y: -1, z: -1 },
        max_corner: { x: 1, y: 1, z: 1 }
      },
      start_state: {
        joint_state: {
          name: jointNames,
          position: currentPositions
        }
      },
      goal_constraints: [{
        joint_constraints: jointNames.map((name, index) => ({
          joint_name: name,
          position: targetPositions[index],
          tolerance_above: 0.01,
          tolerance_below: 0.01,
          weight: 1.0
        }))
      }],
      pipeline_id: 'ompl',
      group_name: 'arm',
      num_planning_attempts: 10,
      allowed_planning_time: 5.0,
      max_velocity_scaling_factor: 1.0,
      max_acceleration_scaling_factor: 1.0
    });

    //PLAN (publikowanie)
    try {
      this.motionPlanRequestPublisher.publish(request);
      console.log('Motion plan request published successfully');

      //EXECUTE (oczekiwanie na plan i wykonanie ruchu)
      setTimeout(() => {
        this.executeTrajectory();
      }, 1000);

    } catch (error) {
      console.error('Error publishing motion plan request:', error);
    }  
  } 

  //EXECUTE (metoda wywołująca usługę) 
  executeTrajectory = () => {
    const executeRequest = new ROSLIB.ServiceRequest({
      request: {
        workspace_parameters: {
          header: { frame_id: 'world' },
          min_corner: { x: -1, y: -1, z: -1 },
          max_corner: { x: 1, y: 1, z: 1 }
        },
        start_state: {
          joint_state: {
            name: [],
            position: []
          }
        },
        goal_constraints: [],
        pipeline_id: 'ompl',
        group_name: 'arm',
        num_planning_attempts: 10,
        allowed_planning_time: 5.0,
        max_velocity_scaling_factor: 0.1,
        max_acceleration_scaling_factor: 0.1
      }
    });

    this.moveGroupServiceClient.callService(executeRequest, (result) => {
      if (result.error_code.val === 1) { // 1 oznacza sukces w MoveIt
        console.log('Trajectory executed successfully');
      } else {
        console.error('Failed to execute trajectory:', result.error_code);
      }
    });
  }

  //Odbieranie położenia przegubów z ROSa
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

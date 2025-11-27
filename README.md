# CobotInt

**Web interface for controlling KUKA LBR IIWA robot via ROS 2**

[![Live Demo](https://img.shields.io/badge/demo-live-success.svg)](https://mates90s.github.io/CobotInt/)
[![ROS 2](https://img.shields.io/badge/ROS%202-Humble-blue.svg)](https://docs.ros.org/en/humble/index.html)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)

A React-based web application that communicates with KUKA LBR IIWA robot through ROS 2 and WebSocket. Control 7-DOF robot joints directly from your browser.

🔗 **[Try Live Demo](https://mates90s.github.io/CobotInt/)**

---

## What It Does

- **Zero installation** - control robot directly from any modern web browser
- **Cross-platform** - works on Windows, macOS, and Linux
- **No desktop software required** - just open the URL and connect
- Real-time communication via WebSocket (rosbridge)
- Individual control of 7 robot joints
- Works with Gazebo simulation and real robot

## Demo

### Setup & Connection
![Setup and Connection](docs/demo-connection.gif)

### Robot Control
![Robot Control](docs/demo-control.gif)

---

## Tech Stack

**Frontend:**
- React 18
- WebSocket API
- GitHub Pages

**Backend:**
- ROS 2 Humble
- rosbridge_suite
- [lbr_fri_ros2_stack](https://github.com/lbr-stack/lbr_fri_ros2_stack)
- Gazebo simulator

---

## Quick Start

### Prerequisites

- Ubuntu 22.04 with ROS 2 Humble
- Node.js 16+
- VirtualBox (if running in VM)

### 1. Setup ROS 2 Environment

```bash
# Install ROS 2 Humble (if not already installed)
sudo apt update && sudo apt install software-properties-common
sudo add-apt-repository universe
sudo apt update && sudo apt install curl -y
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
sudo apt update
sudo apt install ros-humble-desktop

# Source ROS 2
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
source ~/.bashrc

# Install rosbridge
sudo apt install ros-humble-rosbridge-suite

# Clone and build lbr_fri_ros2_stack
mkdir -p ~/ros2_ws/src && cd ~/ros2_ws/src
git clone https://github.com/lbr-stack/lbr_fri_ros2_stack.git
cd ~/ros2_ws
rosdep install --from-paths src --ignore-src -r -y
colcon build --symlink-install
source install/setup.bash
```

### 2. Launch Robot Simulation

**Terminal 1 - Gazebo:**
```bash
source ~/ros2_ws/install/setup.bash
ros2 launch lbr_bringup gazebo.launch.py model:=iiwa7 sim:=gazebo
```

**Terminal 2 - WebSocket Bridge:**
```bash
source /opt/ros/humble/setup.bash
ros2 launch rosbridge_server rosbridge_websocket_launch.xml
```

### 3. Run Web Interface

**Option A - Use hosted version:**
Go to [https://mates90s.github.io/CobotInt/](https://mates90s.github.io/CobotInt/)

**Option B - Run locally:**
```bash
git clone https://github.com/MateS90s/CobotInt.git
cd CobotInt
npm install
npm start
```

### 4. Connect and Control

1. Enter WebSocket URL: `ws://localhost:9090` (or VM IP if remote)
2. Click "Connect"
3. Adjust joint positions using sliders
4. Watch robot move in Gazebo

---

## Architecture

```
Web Browser              Ubuntu VM / ROS 2
┌──────────────┐         ┌─────────────────┐
│  React App   │────────>│  rosbridge WS   │
│  (CobotInt)  │ WS:9090 │                 │
└──────────────┘         └────────┬────────┘
                                  │
                         ┌────────▼────────┐
                         │ lbr_fri_ros2    │
                         └────────┬────────┘
                                  │
                         ┌────────▼────────┐
                         │ Gazebo / Robot  │
                         └─────────────────┘
```

---

## Features & Limitations

### Current Features
✅ 7-DOF joint position control  
✅ WebSocket communication  
✅ Real-time robot feedback  
✅ Gazebo simulation support  

### Planned Features
🔲 Cartesian coordinate control  
🔲 Trajectory planning  
🔲 3D visualization  
🔲 Mobile responsive design  

### Known Limitations
- Joint control only (no Cartesian space)
- Basic UI (prototype stage)
- No authentication/security
- Tested only with iiwa7 in Gazebo

---

## Background

Developed as part of the [Roboti.co](https://www.roboti.co.pl) startup initiative. The startup completed its prototype phase. This web interface was built to explore modern web technologies integration with industrial robotics.

---

## License

MIT License - feel free to use and modify. See [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [lbr_fri_ros2_stack](https://github.com/lbr-stack/lbr_fri_ros2_stack) - KUKA LBR ROS 2 integration
- [rosbridge_suite](https://github.com/RobotWebTools/rosbridge_suite) - ROS WebSocket bridge
- ROS 2 community

---

**Note:** This is a prototype/proof-of-concept project. For production use, additional safety features, error handling, and security measures would be required.
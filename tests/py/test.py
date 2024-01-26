import socketio
import time
import random
from multiprocessing import Process

def send_keydown(key):
    sio.emit('keydown', key)

def send_keyup(key):
    sio.emit('keyup', key)

def jump(duration):
    send_keydown('Space')
    time.sleep(duration)
    send_keyup('Space')

def jump_right(duration):
    send_keydown('KeyD')
    send_keydown('Space')
    time.sleep(duration)
    send_keyup('Space')
    send_keyup('KeyD')

def jump_left(duration):
    send_keydown('KeyA')
    send_keydown('Space')
    time.sleep(duration)
    send_keyup('Space')
    send_keyup('KeyA')

def move_right(duration):
    send_keydown('KeyD')
    time.sleep(duration)
    send_keyup('KeyD')

def move_left(duration):
    send_keydown('KeyA')
    time.sleep(duration)
    send_keyup('KeyA')

def random_crap():
    functions = ["jump", "jump_right", "jump_left", "move_right", "move_left"]
    while True:
        function = random.choice(functions)
        duration = random.uniform(0, 2)
        if function == "jump":
            jump(duration)
        elif function == "jump_right":
            jump_right(duration)
        elif function == "jump_left":
            jump_left(duration)
        elif function == "move_right":
            move_right(duration)
        elif function == "move_left":
            move_left(duration)

def run_random_crap(connection_id):
    print(f"Connection {connection_id} starting")
    sio.connect('http://localhost:5000')
    time.sleep(1)
    random_crap()
    print(f"Connection {connection_id} finished")

sio = socketio.Client()

@sio.event
def connect():
    print('Connected to server')

@sio.event
def disconnect():
    print('Disconnected from server')

if __name__ == "__main__":
    num_connections = 5

    processes = []
    for i in range(num_connections):
        process = Process(target=run_random_crap, args=(i,))
        processes.append(process)
        process.start()

    # time.sleep(5)

    # for process in processes:
    #     process.terminate()

    # sio.disconnect()

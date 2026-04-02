import datetime
import numpy as np
import sys
import pathlib

#taking input vocabulary file , then splitting and converting into a usable list format

inputvocab = sys.argv[1]

def input_vocab(inputvocab):
    try:
        with open(inputvocab, 'r') as vocab:
            content = vocab.read()
            words = [word for word in content.split(',')]
            return words
    except FileNotFoundError:
        print(f"File could not be found !!")
        sys.exit(1)

vocab = input_vocab(inputvocab)

#chat generator function

def generate_chat(vocab):
    
    #path description for ouptut
    script_dir = pathlib.Path(__file__).parent
    root_dir = script_dir.parent
    output_chat = root_dir / "chat.txt"

    #group members' description
    members = {
            "Person1": {
                "attribute": "The Chatterbox",
                "weight": 0.40,          
                "hours": np.arange(8, 24), 
                "length": 5,      
        },
            "Person2": {
                "attribute": "The Quiet Kid",
                "weight": 0.04,          
                "hours": np.arange(9, 21), 
                "length": 8,      
        },
            "Person3": {
                "attribute": "The Night Owl",
                "weight": 0.1,          
                "hours": np.arange(0, 5), 
                "length": 7,      
        },
            "Person4": {
                "attribute": "The Day Boarder",
                "weight": 0.1,          
                "hours": np.arange(7, 20), 
                "length": 10,      
        },
            "Person5": {
                "attribute": "The One Liner",
                "weight": 0.12,          
                "hours": np.arange(10, 24), 
                "length": 2,      
        },
            "Person6": {
                "attribute": "The Long Writer",
                "weight": 0.1,          
                "hours": np.arange(9, 23), 
                "length": 25,      
        },
            "Person7": {
                "attribute": "The Normal Guy",
                "weight": 0.14,          
                "hours": np.arange(9, 24), 
                "length": 8,      
        }
    }
    
    #start and end time
    current_time = datetime.datetime(2026,4,1,12,0)
    end_time = datetime.datetime(2026,4,30,12,0)
    
    message_count = 0

    with open(output_chat, 'w') as chat:

        #time manipulation

        while end_time > current_time:
            time_jump = int(np.random.exponential(scale=15))
            current_time += datetime.timedelta(minutes=time_jump)

            if end_time <= current_time:
                break

            #checking possible senders
        
            online_members = []
            online_members_weight = []
            
            for name, member in members.items():
                if current_time.hour in member["hours"]:
                    online_members.append(name)
                    online_members_weight.append(member["weight"])

            if len(online_members) == 0 :
                continue

            #standardizing weights of online members
            
            online_members_weight = np.array(online_members_weight)
            online_members_weight = online_members_weight / online_members_weight.sum()

            #choosing sender

            sender = np.random.choice(online_members , p = online_members_weight)
            profile = members[sender]
            
            #what to message

            msg_length = np.random.poisson(lam=profile["length"])
            msg_length = max(1, msg_length)

            words = np.random.choice(vocab, size=msg_length)
            message = " ".join(words)

            timestamp = current_time.strftime("%d/%m/%y, %H:%M")
            msg_line = f"{timestamp} - {sender}: {message}\n"
            
            chat.write(msg_line)
            message_count += 1

    
    print(f"Chat generation completed !! Printed {message_count} messages in {output_chat}.")


generate_chat(vocab)

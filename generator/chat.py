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

#helper function to adjust times that exceed midnight(eg : 11am of one day to 1am of next)
def hour_range(start, end):
    if end <= start:
        #(eg : 8 to 2 becomes 8to23 + 0to1)
        return list(range(start, 24)) + list(range(0, end))
    else:
        #(eg : 9 to 21)
        return list(range(start, end))

#chat generator function

def generate_chat(vocab):
    
    #path description for ouptut
    script_dir = pathlib.Path(__file__).parent
    root_dir = script_dir.parent
    output_chat = root_dir / "chat.txt"

    #group members' description
    members = {
            "Dhruv": {
                "attribute": "The Chatterbox",
                "weight": 0.40,          
                "hours": hour_range(9,2), 
                "length": 5,      
        },
            "Shashank": {
                "attribute": "The Quiet Kid",
                "weight": 0.04,          
                "hours": hour_range(9, 3), 
                "length": 8,      
        },
            "Aman": {
                "attribute": "The Night Owl",
                "weight": 0.1,          
                "hours": hour_range(0, 6), 
                "length": 7,      
        },
            "Kaushik": {
                "attribute": "The Day Boarder",
                "weight": 0.1,          
                "hours": hour_range(7, 21), 
                "length": 10,      
        },
            "Sathvik": {
                "attribute": "The One Liner",
                "weight": 0.12,          
                "hours": hour_range(10, 4), 
                "length": 2,      
        },
            "Parth": {
                "attribute": "The Long Writer",
                "weight": 0.1,          
                "hours": np.arange(9, 1), 
                "length": 25,      
        },
            "Gururatna": {
                "attribute": "The Normal Guy",
                "weight": 0.14,          
                "hours": np.arange(9, 24), 
                "length": 8,      
        }
    }
    
    #vocab including names and @
    newvocab = vocab + ["@"] + list(members.keys())

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

            words = np.random.choice(newvocab, size=msg_length)
            message = " ".join(words)

            timestamp = current_time.strftime("%d/%m/%y, %H:%M")
            msg_line = f"{timestamp} - {sender}: {message}\n"
            
            chat.write(msg_line)
            message_count += 1

    
    print(f"Chat generation completed !! Printed {message_count} messages in {output_chat}.")


generate_chat(vocab)

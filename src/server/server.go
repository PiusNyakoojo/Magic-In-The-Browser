package main 

import (
	"log"
	"fmt"
	"github.com/gorilla/websocket"
	"net/http"
	"text/template"
	"sync"
	"time"
	"math/rand"
	"encoding/json"
	"os"
)

var (
	
	letters = "0123456789ABCDEF"
	
	connections = struct {
		sync.RWMutex
		m map[*websocket.Conn]Player
	}{ m: make( map[*websocket.Conn]Player ) }

	upgrader = websocket.Upgrader {
		ReadBufferSize: 1024,
		WriteBufferSize: 1024,
	}

)

type Player struct {
	ID string
	Username string
	Opponent *websocket.Conn
	inLobby bool
}

type PlayerAction struct {
	Title string
	Amount int
}

type Message struct {
	Title string
	Player Player
}

type PlayerMessage struct {
	Title string
	Action PlayerAction
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)

	if _, ok := err.(websocket.HandshakeError); ok {
		http.Error(w, "Not a websocket handshake", 400)
		return
	} else if err != nil {
		log.Println(err)
		return
	}

	log.Println("Successfully upgraded connection")

	for {
		_, msg, err := conn.ReadMessage()

		if err != nil {
			closeConnection( conn )
			return
		}
		
		if string(msg) == "Keep connection alive!" {
			continue
		}
		
		var result PlayerMessage
		
		err = json.Unmarshal([]byte(msg), &result)
	    if err != nil {
	        fmt.Println(err)
	        fmt.Printf("%+v\n", result)
	    }
	    
	    switch result.Title {

	    	case "setUsername":

	    		connections.Lock()
				connections.m[conn] = Player { ID: generateID(), Username: result.Action.Title, inLobby: true }
				connections.Unlock()
	   			
	   			for oldconn := range connections.m {
					addOtherPlayers( conn, oldconn ) // show other players to new player: in Lobby
					
					addNewPlayer( conn, oldconn ) // show new player to other players: in Lobby
				}
	    	case "requestToPlay":
	    		for oldconn := range connections.m {
	    			if result.Action.Title == connections.m[oldconn].Username && connections.m[oldconn].inLobby {
	    				result.Action.Title = connections.m[conn].Username
	    				updatePlayer( conn, oldconn, result )
	    			} else if ! connections.m[oldconn].inLobby {
	    				log.Println("Sorry, player's not in lobby")
	    			}
	    		}
	    	case "respondToRequest":
	    		for oldconn := range connections.m {
	    			if result.Action.Title == connections.m[oldconn].Username && result.Action.Amount == 0 { // Request Rejected
	    				updatePlayer( conn, oldconn, result )
	    			} else if result.Action.Title == connections.m[oldconn].Username && result.Action.Amount == 1 { // Request Accepted
						
						connections.m[conn] = Player { Username : connections.m[conn].Username, inLobby: false, Opponent: oldconn }
						connections.m[oldconn] = Player { Username : connections.m[oldconn].Username, inLobby: false, Opponent: conn }

	    				updatePlayer( conn, oldconn, result )
	    				
	    				result.Title = "removePlayer2"
	    				
	    				for otherconn := range connections.m {
	    					if otherconn != oldconn && otherconn != conn {
	    						result.Action.Title = connections.m[conn].Username
	    						updatePlayer( conn, otherconn, result )
	    						result.Action.Title = connections.m[oldconn].Username
	    						updatePlayer( oldconn, otherconn, result )
	    					}
	    				}

	    			} else if result.Action.Title == connections.m[oldconn].Username && result.Action.Amount == 2 { // Request Rejected; Already being requested
	    				updatePlayer( conn, oldconn, result )
	    			}
	    		}
	    	case "updateHealth":
	    		updatePlayer( conn, connections.m[conn].Opponent, result )
	    	case "stopTimer":
	    		updatePlayer( conn, connections.m[conn].Opponent, result )
	    	case "skipPhase":
	    		updatePlayer( conn, connections.m[conn].Opponent, result )
	    	case "playCard": 
	    		log.Println( connections.m[conn].Username + " is telling " + connections.m[connections.m[conn].Opponent].Username )
		    	updatePlayer( conn, connections.m[conn].Opponent, result )

		    	//time.Sleep( time.Nanosecond )
	    	case "removePlayer": // Player joined game, remove him/her from lobby
	    		connections.m[conn] = Player { ID: connections.m[conn].ID, inLobby: false }

	    		for oldconn := range connections.m {
	    			updatePlayer( conn, oldconn, result )
	    		}
	    }
		
	}
}

func updatePlayer( conn *websocket.Conn, oldconn *websocket.Conn, data PlayerMessage ) {
	if conn != oldconn {
		message, _ := json.Marshal(&data)
		
		if err := oldconn.WriteMessage(websocket.TextMessage, message); err != nil {
			closeConnection( oldconn )
		}
	}
}

func addOtherPlayers( conn *websocket.Conn, oldconn *websocket.Conn) {
	if conn != oldconn && connections.m[oldconn].inLobby {
		message, _ := json.Marshal(&Message{ Title: "addPlayer", Player: connections.m[oldconn] })

		if err := conn.WriteMessage(websocket.TextMessage, message); err != nil {
			closeConnection( conn )
		}
	}
}

func addNewPlayer( conn *websocket.Conn, oldconn *websocket.Conn) {
	if conn != oldconn && connections.m[oldconn].inLobby {
		message, _ := json.Marshal(&Message{ Title: "addPlayer", Player: connections.m[conn] })

		if err := oldconn.WriteMessage(websocket.TextMessage, message); err != nil {
			closeConnection( oldconn )
		}
	}
}

func closeConnection( conn *websocket.Conn ) {
	
	for oldconn := range connections.m {
		if conn != oldconn {
			message, _ := json.Marshal(&Message{ Title: "removePlayer", Player: connections.m[conn] })
			
			if err := oldconn.WriteMessage(websocket.TextMessage, message); err != nil {
				log.Println( "Error" )
			}
		}
	}
	connections.Lock()
	delete(connections.m, conn)
	connections.Unlock()
	conn.Close()
}

func generateID() string {
	
	str := ""
	
	rand.Seed(time.Now().UnixNano())
	
	for i := 0; i < 6; i++ {
		num := rand.Intn(5)
		str += letters[num: num + 1]
	}
	
	return str
}

func main() {
	port := GetPort()

	http.HandleFunc("/", serveIndex)
	http.HandleFunc("/ws", wsHandler)
	/*
	http.HandleFunc("/css/", serveStatic)
	http.HandleFunc("/js/", serveStatic)
	http.HandleFunc("/images/", serveStatic)
	*/
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("css"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("js"))))
	http.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("images"))))
	
	log.Printf("Running on port" + port)

	err := http.ListenAndServe(port, nil)
	log.Println(err.Error())
}

func serveIndex(w http.ResponseWriter, r *http.Request) {
	template.Must(template.ParseFiles("html/client.html")).Execute(w, nil)
}

func serveStatic(w http.ResponseWriter, r *http.Request) {
	template.Must(template.ParseFiles(r.URL.Path[1:])).Execute(w, nil)
}

func GetPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
		log.Println("[-] No PORT environment variable detected. Setting to ", port)
	}
	return ":" + port
}
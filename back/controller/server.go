package controller

import (
	"fmt"
	"net/http"

	"github.com/sirupsen/logrus"
)

func root(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	log := logrus.WithContext(r.Context()).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("Root endpoint triggered")
	w.WriteHeader(http.StatusNotFound)
	fmt.Fprintf(w, "Not found")
}

func StartServer(path string) {
	server := http.NewServeMux()
	server.HandleFunc("/", root)
	server.HandleFunc("/ping", ping)
	server.HandleFunc("/login", login)
	server.HandleFunc("/register", register)
	server.HandleFunc("/refresh", refresh)
	server.HandleFunc("/user/delete", middlewareWrapper(deleteAccount))
	server.HandleFunc("/user/password", middlewareWrapper(changePassword))
	server.HandleFunc("/who-am-i", middlewareWrapper(whoAmI))

	fmt.Printf("Listening on '%s'\n", path)
	http.ListenAndServe(path, server)
}

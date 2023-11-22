package controller

import (
	"fmt"
	"net/http"

	"github.com/sirupsen/logrus"
)

func root(w http.ResponseWriter, r *http.Request) {
	log := logrus.WithContext(r.Context()).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("Root endpoint triggered")
	w.WriteHeader(http.StatusNotFound)
	fmt.Fprintf(w, "Not found")
}

func corsWrapper(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS, PUT")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Everything is JSON
		w.Header().Set("Content-Type", "application/json")

		next(w, r)
	}
}

func StartServer(path string) {
	server := http.NewServeMux()
	server.HandleFunc("/", corsWrapper(root))
	server.HandleFunc("/ping", corsWrapper(ping))

	server.HandleFunc("/login", corsWrapper(login))
	server.HandleFunc("/register", corsWrapper(register))
	server.HandleFunc("/refresh", corsWrapper(refresh))
	server.HandleFunc("/user/delete", middlewareWrapper(deleteUser))
	server.HandleFunc("/user/update", middlewareWrapper(updateUser))
	server.HandleFunc("/user/password", middlewareWrapper(changePassword))
	server.HandleFunc("/who-am-i", middlewareWrapper(whoAmI))

	server.HandleFunc("/article-type", corsWrapper(getArticleType))
	server.HandleFunc("/article-type/create", middlewareWrapper(postArticleType))
	server.HandleFunc("/article-type/update", middlewareWrapper(putArticleType))
	server.HandleFunc("/article-type/delete", middlewareWrapper(deleteArticleType))

	server.HandleFunc("/color", corsWrapper(getColor))
	server.HandleFunc("/color/create", middlewareWrapper(postColor))
	server.HandleFunc("/color/update", middlewareWrapper(putColor))
	server.HandleFunc("/color/delete", middlewareWrapper(deleteColor))

	server.HandleFunc("/text-block", corsWrapper(getTextBlock))
	server.HandleFunc("/text-block/create", middlewareWrapper(postTextBlock))
	server.HandleFunc("/text-block/update", middlewareWrapper(putTextBlock))
	server.HandleFunc("/text-block/delete", middlewareWrapper(deleteTextBlock))

	fmt.Printf("Listening on '%s'\n", path)
	http.ListenAndServe(path, server)
}

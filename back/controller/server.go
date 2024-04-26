package controller

import (
	"fmt"
	"net/http"
	"os"

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

	server.HandleFunc("/text-block", corsWrapper(getTextBlock))
	server.HandleFunc("/text-block/create", middlewareWrapper(postTextBlock))
	server.HandleFunc("/text-block/update", middlewareWrapper(putTextBlock))
	server.HandleFunc("/text-block/delete", middlewareWrapper(deleteTextBlock))

	server.HandleFunc("/article-type", corsWrapper(getArticleType))
	server.HandleFunc("/article-type/create", middlewareWrapper(postArticleType))
	server.HandleFunc("/article-type/update", middlewareWrapper(putArticleType))
	server.HandleFunc("/article-type/delete", middlewareWrapper(deleteArticleType))

	server.HandleFunc("/article-color", corsWrapper(getArticleColor))
	server.HandleFunc("/article-color/create", middlewareWrapper(postArticleColor))
	server.HandleFunc("/article-color/update", middlewareWrapper(putArticleColor))
	server.HandleFunc("/article-color/delete", middlewareWrapper(deleteArticleColor))

	server.HandleFunc("/article-shape", corsWrapper(getArticleShape))
	server.HandleFunc("/article-shape/create", middlewareWrapper(postArticleShape))
	server.HandleFunc("/article-shape/update", middlewareWrapper(putArticleShape))
	server.HandleFunc("/article-shape/delete", middlewareWrapper(deleteArticleShape))

	server.HandleFunc("/article-tone", corsWrapper(getArticleTone))
	server.HandleFunc("/article-tone/create", middlewareWrapper(postArticleTone))
	server.HandleFunc("/article-tone/update", middlewareWrapper(putArticleTone))
	server.HandleFunc("/article-tone/delete", middlewareWrapper(deleteArticleTone))

	server.HandleFunc("/file/download/", corsWrapper(downloadFile))
	server.HandleFunc("/file/create", middlewareWrapper(postFile))
	server.HandleFunc("/file/delete/", middlewareWrapper(deleteFile))

	server.HandleFunc("/caroussel-homepage-img", corsWrapper(getCarousselHomepageImg))
	server.HandleFunc("/caroussel-homepage-img/create", middlewareWrapper(postCarousselHomepageImg))
	server.HandleFunc("/caroussel-homepage-img/update", middlewareWrapper(putCarousselHomepageImg))
	server.HandleFunc("/caroussel-homepage-img/delete", middlewareWrapper(deleteCarousselHomepageImg))

	server.HandleFunc("/article", corsWrapper(getArticle))
	server.HandleFunc("/article/create", middlewareWrapper(postArticle))
	server.HandleFunc("/article/update", middlewareWrapper(putArticle))
	server.HandleFunc("/article/delete", middlewareWrapper(deleteArticle))

	server.HandleFunc("/colors-of-the-week", corsWrapper(getColorsOfTheWeek))
	server.HandleFunc("/colors-of-the-week/create", middlewareWrapper(postColorsOfTheWeek))
	server.HandleFunc("/colors-of-the-week/delete", middlewareWrapper(deleteColorsOfTheWeek))

	server.HandleFunc("/favorite", middlewareWrapper(getFavorite))
	server.HandleFunc("/favorite/create", middlewareWrapper(postFavorite))
	server.HandleFunc("/favorite/delete", middlewareWrapper(deleteFavorite))

	// server.HandleFunc("/temp-cart", middlewareWrapper(getTempCart))
	// server.HandleFunc("/temp-cart/create", middlewareWrapper(postTempCart))
	// server.HandleFunc("/temp-cart/delete", middlewareWrapper(deleteTempCart))

	fmt.Printf("Listening on '%s'\n", path)

	if os.Getenv("HTTPS") == "true" {
		if os.Getenv("SSL_CRT_FILE") == "" || os.Getenv("SSL_KEY_FILE") == "" {
			logrus.Fatal("SSL_CRT_FILE and SSL_KEY_FILE must be set")
		}
		if _, err := os.Stat(os.Getenv("SSL_CRT_FILE")); os.IsNotExist(err) {
			logrus.Fatal(os.Getenv("SSL_CRT_FILE") + " not found")
		}
		if _, err := os.Stat(os.Getenv("SSL_KEY_FILE")); os.IsNotExist(err) {
			logrus.Fatal(os.Getenv("SSL_KEY_FILE") + " not found")
		}

		err := http.ListenAndServeTLS(path, os.Getenv("SSL_CRT_FILE"), os.Getenv("SSL_KEY_FILE"), server)
		if err != nil {
			logrus.Fatal("ListenAndServe: ", err)
		}
	} else {
		err := http.ListenAndServe(path, server)
		if err != nil {
			logrus.Fatal("ListenAndServe: ", err)
		}
	}
}

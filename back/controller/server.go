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
	server.HandleFunc("/api/", corsWrapper(root))
	server.HandleFunc("/api/ping", corsWrapper(ping))

	server.HandleFunc("/api/login", corsWrapper(login))
	server.HandleFunc("/api/register", corsWrapper(register))
	server.HandleFunc("/api/refresh", corsWrapper(refresh))
	server.HandleFunc("/api/user/delete", middlewareWrapper(deleteUser))
	server.HandleFunc("/api/user/update", middlewareWrapper(updateUser))
	server.HandleFunc("/api/user/password", middlewareWrapper(changePassword))
	server.HandleFunc("/api/who-am-i", middlewareWrapper(whoAmI))

	server.HandleFunc("/api/text-block", corsWrapper(getTextBlock))
	server.HandleFunc("/api/text-block/create", middlewareWrapper(postTextBlock))
	server.HandleFunc("/api/text-block/update", middlewareWrapper(putTextBlock))
	server.HandleFunc("/api/text-block/delete", middlewareWrapper(deleteTextBlock))

	server.HandleFunc("/api/article-type", corsWrapper(getArticleType))
	server.HandleFunc("/api/article-type/create", middlewareWrapper(postArticleType))
	server.HandleFunc("/api/article-type/update", middlewareWrapper(putArticleType))
	server.HandleFunc("/api/article-type/delete", middlewareWrapper(deleteArticleType))

	server.HandleFunc("/api/article-color", corsWrapper(getArticleColor))
	server.HandleFunc("/api/article-color/create", middlewareWrapper(postArticleColor))
	server.HandleFunc("/api/article-color/update", middlewareWrapper(putArticleColor))
	server.HandleFunc("/api/article-color/delete", middlewareWrapper(deleteArticleColor))

	server.HandleFunc("/api/article-shape", corsWrapper(getArticleShape))
	server.HandleFunc("/api/article-shape/create", middlewareWrapper(postArticleShape))
	server.HandleFunc("/api/article-shape/update", middlewareWrapper(putArticleShape))
	server.HandleFunc("/api/article-shape/delete", middlewareWrapper(deleteArticleShape))

	server.HandleFunc("/api/article-tone", corsWrapper(getArticleTone))
	server.HandleFunc("/api/article-tone/create", middlewareWrapper(postArticleTone))
	server.HandleFunc("/api/article-tone/update", middlewareWrapper(putArticleTone))
	server.HandleFunc("/api/article-tone/delete", middlewareWrapper(deleteArticleTone))

	server.HandleFunc("/api/file/download/", corsWrapper(downloadFile))
	server.HandleFunc("/api/file/create", middlewareWrapper(postFile))
	server.HandleFunc("/api/file/delete/", middlewareWrapper(deleteFile))

	server.HandleFunc("/api/caroussel-homepage-img", corsWrapper(getCarousselHomepageImg))
	server.HandleFunc("/api/caroussel-homepage-img/create", middlewareWrapper(postCarousselHomepageImg))
	server.HandleFunc("/api/caroussel-homepage-img/update", middlewareWrapper(putCarousselHomepageImg))
	server.HandleFunc("/api/caroussel-homepage-img/delete", middlewareWrapper(deleteCarousselHomepageImg))

	server.HandleFunc("/api/article", corsWrapper(getArticle))
	server.HandleFunc("/api/article/create", middlewareWrapper(postArticle))
	server.HandleFunc("/api/article/update", middlewareWrapper(putArticle))
	server.HandleFunc("/api/article/delete", middlewareWrapper(deleteArticle))

	server.HandleFunc("/api/colors-of-the-week", corsWrapper(getColorsOfTheWeek))
	server.HandleFunc("/api/colors-of-the-week/create", middlewareWrapper(postColorsOfTheWeek))
	server.HandleFunc("/api/colors-of-the-week/delete", middlewareWrapper(deleteColorsOfTheWeek))

	server.HandleFunc("/api/favorite", middlewareWrapper(getFavorite))
	server.HandleFunc("/api/favorite/create", middlewareWrapper(postFavorite))
	server.HandleFunc("/api/favorite/delete", middlewareWrapper(deleteFavorite))

	// server.HandleFunc("/api/temp-cart", middlewareWrapper(getTempCart))
	// server.HandleFunc("/api/temp-cart/create", middlewareWrapper(postTempCart))
	// server.HandleFunc("/api/temp-cart/delete", middlewareWrapper(deleteTempCart))

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

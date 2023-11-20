package utils

type ResErr struct {
	Err string `json:"err"`
}

func NewResErr(err string) *ResErr {
	return &ResErr{
		Err: err,
	}
}

func (r *ResErr) ToJson() []byte {
	return []byte(`{"err": "` + r.Err + `"}`)
}

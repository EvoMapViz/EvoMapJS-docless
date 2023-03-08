library(rjson)

circles_json <- read_json('./circles_CLEAN_TEMPLATE_DO_NOT_ERASE.json')

json_wo_rank <- lapply(circles_json, function(x){x[attributes(x)$names != 'rank']})

jsonData <- toJSON(json_wo_rank, auto_unbox = TRUE) # auto_unbox avoids toJSON adding square braquets around each value

write(jsonData, "cicles_no_rank.json")


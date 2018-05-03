# namugazi
> [나무위키] 경로 탐색기

[나무위키]에서 했던 일을 떠올려 보세요. 어느새 처음 봤던 문서와는 전혀 관계없는 문서까지 빙빙 돌아간 경험, [다들 한 번쯤은 겪어 보셨을 겁니다][위키니트]. 하지만 **나뭇가지™** 가 있다면 이제 낭비되는 시간을 걱정할 필요가 없습니다. `FIRST` 문서에서 `LAST` 문서까지 가장 적은 클릭만으로 도착할 수 있는 경로를 [빠르게 찾아주니까요][BFS].

## 예시
`$ FIRST="나무위키:대문" LAST="BFS" npm start`

```
dequeue 나무위키:대문
enqueue 나무위키
enqueue 나무위키:FAQ/소유권 이전
enqueue 분류:나무위키
...
dequeue 나무위키
enqueue 리그베다 위키
enqueue 데이터베이스
enqueue 구글
...
dequeue 구글
enqueue 파일:구글.png
enqueue 유튜브
enqueue 알고리즘
...
dequeue 알고리즘
enqueue 컴퓨터 과학
enqueue 프로그래밍
enqueue 분할 정복법
enqueue BFS
found

나무위키:대문
나무위키
구글
알고리즘
BFS

time 35462
done
```

## 요구사항
- [npm] v5.3.0
- [Node.js] v8.2.1
- [MongoDB] v3.4.6
- 5GB 이상의 메모리
- 10GB 이상의 저장 공간

## 사용법
1. [Node.js]를 [설치하세요][Node.js download]. [npm]은 [Node.js] 설치할 때 알아서 함께 설치됩니다.
1. [Git]으로 이 저장소를 복제하세요. [Git]이 없다면 [ZIP] 파일을 받아서 압축 파일을 푸셔도 됩니다.
1. [나무위키:데이터베이스 덤프]에서 JSON 파일을 받으세요. 이거 용량이 장난 아니에요. 약 8GB.
1. `namugazi` 폴더로 다운로드한 JSON 파일을 옮기고, `namuwiki.json`로 이름을 바꾸세요.
1. `$ mongod` 명령어로 [MongoDB]를 켜세요. 없다면 [여기][MongoDB download]에서 받아서 설치하세요.
1. `namugazi` 폴더에서 `$ npm run wiki` 명령어로 [나무위키] 데이터를 불러오세요.
1. `$ FIRST="제이나 프라우드무어" LAST=빛나래 npm start` 명령어로 실행을 확인해 보세요.

## 스크립트
- `$ npm test` - 코드 스타일 검사입니다. 별다른 동작 테스트는 만들기 귀찮아서...
- `$ npm run wiki` - `mongoimport` 명령어를 사용해 [나무위키] 데이터를 불러옵니다.
- `$ npm run surf` - 랜덤 문서에서 시작해, 더 이상 링크가 안 나올 때까지 무작위로 이동한 결과를 출력합니다.

## 환경변수
| 이름 | 설명 |
| :-- | :-- |
| `FIRST` | 출발할 문서의 제목입니다.<br>문서가 존재하지 않는다면 실행이 바로 종료됩니다. |
| `LAST` | 도착할 문서의 제목입니다.<br>문서 또는 문서의 *역링크*가 존재하지 않는다면 실행이 바로 종료됩니다. |
| `RESULT_PATH` | 실행 결과가 저장될 파일의 경로입니다.<br>따로 설정하지 않았다면 `./result.txt`를 기본으로 사용합니다.
| `NO_DATE` | **1**이면, *날짜* 관련 문서를 탐색 과정에서 무시합니다.<br>`^\d+세기$`, `^\d+년$` 또는 `^\d+월 \d+일$` 정규식에 매칭되는 문서가 해당됩니다. |
| `MUTE_STATUS` | **1**이면, 매 반복마다 현재 상태를 출력하지 않습니다. |
| `PRINT_DEQUEUE` | **1**이면, 큐에서 문서를 꺼낼 때 로그가 출력됩니다. |
| `PRINT_ENQUEUE` | **1**이면, 큐에 다음에 탐색할 문서를 집어넣을 때 로그가 출력됩니다. |

환경변수를 설정하기 힘들거나 매번 입력하는 게 귀찮으시다면 `.env` 파일에 설정을 저장해 두세요. `.env` 파일의 자세한 사용법은 [dotenv] 저장소에 예쁘게 설명되어 있습니다.

## 라이선스
[MIT 라이선스](LICENSE) 하에 배포됩니다.

### 나무위키 데이터베이스 덤프 파일 라이선스
> 이 저작물은 [CC BY-NC-SA 2.0 KR]에 따라 이용할 수 있습니다. (단, 라이선스가 명시된 일부 문서 및 삽화 제외)
기여하신 문서의 저작권은 각 기여자에게 있으며, 각 기여자는 기여하신 부분의 저작권을 갖습니다.

[npm]: https://www.npmjs.com/
[Node.js]: https://nodejs.org/en
[Node.js download]: https://nodejs.org/en/download/current/

[Git]: https://git-scm.com/
[ZIP]: https://github.com/ChalkPE/namugazi/archive/master.zip

[MongoDB]: https://www.mongodb.com
[MongoDB download]: https://www.mongodb.com/download-center

[나무위키]: https://namu.wiki
[위키니트]: https://namu.wiki/w/%EC%9C%84%ED%82%A4%EB%8B%88%ED%8A%B8
[BFS]: https://namu.wiki/w/BFS
[CC BY-NC-SA 2.0 KR]: https://creativecommons.org/licenses/by-nc-sa/2.0/kr/
[나무위키:데이터베이스 덤프]: https://namu.wiki/w/%EB%82%98%EB%AC%B4%EC%9C%84%ED%82%A4%3A%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4%20%EB%8D%A4%ED%94%84

[dotenv]: https://github.com/motdotla/dotenv

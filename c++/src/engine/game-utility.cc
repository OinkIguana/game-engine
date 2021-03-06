#include "game-utility.h"
#include "collider.h"
#include "sprite.h"
#include "sound.h"

namespace Game {
    GameUtility::GameUtility(Engine & eng) : _eng{ eng } {}

    Dimension GameUtility::size() const {
        return _eng.size();
    }

    Rectangle GameUtility::view() const {
        return _eng._views.back();
    }

    void GameUtility::view(const Position & v, bool constrain) {
        auto s = _eng._views.back();
        view(Rectangle{ v.x - s.w / 2, v.y - s.h / 2, s.w, s.h }, constrain);
    }

    void GameUtility::view(const Rectangle & v, bool constrain) {
        const Dimension &r = _eng._rooms.back()->size();
        Rectangle view = v;
        if(constrain) {
            if(view.w > r.w) {
                view.x = (r.w - view.w) / 2;
            } else if(view.x < 0) {
                view.x = 0;
            } else if(view.x + view.w > r.w) {
                view.x = r.w - view.w;
            }
            if(view.h > r.h) {
                view.y = (r.h - view.h) / 2;
            } else if(view.y < 0) {
                view.y = 0;
            } else if(view.y + view.h > r.h) {
                view.y = r.h - view.h;
            }
        }
        _eng._views.back() = view;
    }

    void GameUtility::room_close() {
        _eng.proc(Event{ Event::RoomEnd, { _eng._rooms.back()->id, -1} });
        _eng._rooms.back()->end();
        // store these for the rest of this frame so the events all finish
        _eng._delete_rooms.emplace_back(std::move( _eng._rooms.back() ));
        _eng._delete_objects.emplace_back(std::move( _eng._objects.back() ));
        _eng._rooms.pop_back();
        _eng._objects.pop_back();
        _eng._views.pop_back();
    }

    void GameUtility::end() { _eng._ended = true; }
    void GameUtility::restart() { end(); _eng._restart = true; }

    Sound & GameUtility::sound(const std::string & name) {
        return _eng._sound->sound(name);
    }
    void GameUtility::music(const std::string & name) {
        _eng._sound->music(name);
    }

    void GameUtility::stop_music() {
        _eng._sound->stop_music();
    }

    bool GameUtility::mousestate(int button) {
        return _eng._input.mousestate(button);
    }

    bool GameUtility::keystate(int key) {
        return _eng._input.keystate(key);
    }

    void GameUtility::destroy(Object & who) {
        _eng._rooms[0]->destroy(who);
    }

    bool GameUtility::collides(const Rectangle & where) {
        return collides_room(where) || collides<Collider>(where);
    }

    Collider * GameUtility::collides(const Rectangle & where, Collider & who) {
        return who.collides(where) ? &who : nullptr;
    }

    bool GameUtility::collides_room(const Rectangle & where) {
        return _eng._rooms.back()->collides(where);
    }

    std::unique_ptr<Sprite> GameUtility::make_sprite(const std::string & name) {
        return _eng._texture->sprite(name);
    }
}

#ifndef __DEMO_OBJ_DOOR_H__
#define __DEMO_OBJ_DOOR_H__

#include "../../engine.h"
#include "player.h"

namespace Demo {
    template<typename Dest>
    class Door : public virtual Game::Object, public Game::Collider {
        Game::Position _pos, _outpos;
        Player * _player;
        Game::Sound * _sound;
        bool check_collision();
    public:
        Door(const Game::Position & pos, const Game::Position & outpos);
        virtual void init();
        virtual void step() override;
        virtual Game::Position position() const override;
        virtual Game::Rectangle bbox() const override;
    };

    template<typename Dest>
    Door<Dest>::Door(const Game::Position & pos, const Game::Position & outpos) : _pos{ pos }, _outpos{ outpos } {}

    template<typename Dest>
    void Door<Dest>::init() {
        _sound = & game().sound("door");
        _player = game().template find<Player>().back();
    }

    template<typename Dest>
    bool Door<Dest>::check_collision() {
        auto box = bbox();
        auto where = position();
        box.x += where.x;
        box.y += where.y;
        return game().collides(box, *_player);
    }

    template<typename Dest>
    void Door<Dest>::step() {
        if(check_collision()) {
            _sound->play();
            _player->sprite().x = _outpos.x;
            _player->sprite().y = _outpos.y;
            game().template room_goto<Dest>();
        }
    }

    template<typename Dest>
    Game::Position Door<Dest>::position() const {
        return _pos;
    }

    template<typename Dest>
    Game::Rectangle Door<Dest>::bbox() const {
        return { 0, 0, 32, 32 };
    }
}

#endif

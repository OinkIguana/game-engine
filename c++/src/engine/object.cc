#include "object.h"
#include "engine.h"

namespace Game {
    bool Object::persistent = false;

    Object::Object() {}
    Object::~Object() {}

    void Object::init(Engine * eng) { _eng = eng; }

    void Object::gamestart() {}
    void Object::roomstart(int prev, int next) {}

    void Object::stepstart() {}

    void Object::mousemove(const Position & where) {}
    void Object::keydown(const int which) {}
    void Object::mousedown(const int which) {}
    void Object::keyup(const int which) {}
    void Object::mouseup(const int which) {}

    void Object::step() {}
    void Object::stepend() {}

    void Object::roomend(int prev, int next) {}
    void Object::gameend() {}

    void Object::proc(const Event & event) {
        switch(event.type) {
        case Event::KeyDown:
            keydown(event.data[0]);
            break;
        case Event::KeyUp:
            keyup(event.data[0]);
            break;
        case Event::MouseDown:
            mousedown(event.data[0]);
            break;
        case Event::MouseUp:
            mouseup(event.data[0]);
            break;
        case Event::MouseMove:
            mousemove({event.data[0], event.data[1]});
            break;
        case Event::RoomStart:
            roomstart(event.data[0], event.data[1]);
            break;
        case Event::RoomEnd:
            roomend(event.data[0], event.data[1]);
            break;
        case Event::GameStart:
            gamestart();
            break;
        case Event::GameEnd:
            gameend();
            break;
        default:
            break;
        }
    }

    GameUtility & Object::game() { return _eng->util(); }
};
